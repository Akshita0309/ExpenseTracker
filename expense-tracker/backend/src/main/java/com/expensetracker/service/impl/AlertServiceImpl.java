package com.expensetracker.service.impl;

import com.expensetracker.dto.response.AlertResponse;
import com.expensetracker.entity.Alert;
import com.expensetracker.entity.Budget;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.AlertRepository;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.service.AlertService;
import com.expensetracker.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {

    private final AlertRepository alertRepository;
    private final BudgetRepository budgetRepository;
    private final BudgetService budgetService;

    @Override
    public List<AlertResponse> getAll(Long userId) {
        return alertRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public AlertResponse markAsRead(Long userId, Long id) {
        Alert alert = alertRepository.findById(id)
                .filter(a -> a.getUser().getId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found"));
        alert.setIsRead(true);
        return toResponse(alertRepository.save(alert));
    }

    @Override
    public void runBudgetCheckForAllUsers() {
        LocalDate now = LocalDate.now();
        List<Budget> currentBudgets = budgetRepository.findByMonthAndYear(now.getMonthValue(), now.getYear());
        for (Budget budget : currentBudgets) {
            budgetService.checkAndTriggerAlert(
                    budget.getUser().getId(), budget.getCategory().getId(), budget.getMonth(), budget.getYear());
        }
    }

    private AlertResponse toResponse(Alert alert) {
        return AlertResponse.builder()
                .id(alert.getId())
                .budgetId(alert.getBudget().getId())
                .categoryName(alert.getBudget().getCategory().getName())
                .message(alert.getMessage())
                .isRead(alert.getIsRead())
                .createdAt(alert.getCreatedAt())
                .build();
    }
}
