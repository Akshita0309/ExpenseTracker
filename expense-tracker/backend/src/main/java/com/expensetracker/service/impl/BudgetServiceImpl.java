package com.expensetracker.service.impl;

import com.expensetracker.dto.request.BudgetRequest;
import com.expensetracker.dto.response.BudgetResponse;
import com.expensetracker.entity.Alert;
import com.expensetracker.entity.Budget;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.User;
import com.expensetracker.exception.BadRequestException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.AlertRepository;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.TransactionRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private static final BigDecimal ALERT_THRESHOLD = new BigDecimal("0.90"); // 90%

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final AlertRepository alertRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public BudgetResponse create(Long userId, BudgetRequest request) {
        Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (budgetRepository.findByUserIdAndCategoryIdAndMonthAndYear(
                userId, category.getId(), request.getMonth(), request.getYear()).isPresent()) {
            throw new BadRequestException("A budget already exists for this category and period");
        }

        User user = userRepository.getReferenceById(userId);
        Budget budget = Budget.builder()
                .category(category)
                .limitAmount(request.getLimitAmount())
                .month(request.getMonth())
                .year(request.getYear())
                .user(user)
                .build();

        return toResponse(budgetRepository.save(budget));
    }

    @Override
    public List<BudgetResponse> getAll(Long userId, Integer month, Integer year) {
        int m = month != null ? month : LocalDate.now().getMonthValue();
        int y = year != null ? year : LocalDate.now().getYear();
        return budgetRepository.findByUserIdAndMonthAndYear(userId, m, y).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public BudgetResponse update(Long userId, Long id, BudgetRequest request) {
        Budget budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        budget.setCategory(category);
        budget.setLimitAmount(request.getLimitAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());

        return toResponse(budgetRepository.save(budget));
    }

    @Override
    @Transactional
    public void delete(Long userId, Long id) {
        Budget budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        budgetRepository.delete(budget);
    }

    @Override
    @Transactional
    public void checkAndTriggerAlert(Long userId, Long categoryId, Integer month, Integer year) {
        budgetRepository.findByUserIdAndCategoryIdAndMonthAndYear(userId, categoryId, month, year)
                .ifPresent(this::evaluateAndAlert);
    }

    private void evaluateAndAlert(Budget budget) {
        BigDecimal spent = spentForBudget(budget);
        if (budget.getLimitAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }
        BigDecimal ratio = spent.divide(budget.getLimitAmount(), 4, RoundingMode.HALF_UP);

        String message = null;
        if (spent.compareTo(budget.getLimitAmount()) > 0) {
            message = String.format("You've exceeded your %s budget for %d/%d (spent %.2f of %.2f)",
                    budget.getCategory().getName(), budget.getMonth(), budget.getYear(), spent, budget.getLimitAmount());
        } else if (ratio.compareTo(ALERT_THRESHOLD) >= 0) {
            message = String.format("You've used %.0f%% of your %s budget for %d/%d",
                    ratio.doubleValue() * 100, budget.getCategory().getName(), budget.getMonth(), budget.getYear());
        }

        if (message != null && !alertRepository.existsByBudgetIdAndMessage(budget.getId(), message)) {
            Alert alert = Alert.builder()
                    .budget(budget)
                    .message(message)
                    .user(budget.getUser())
                    .build();
            alertRepository.save(alert);
        }
    }

    private BigDecimal spentForBudget(Budget budget) {
        YearMonth ym = YearMonth.of(budget.getYear(), budget.getMonth());
        return transactionRepository.sumExpenseByCategoryBetween(
                budget.getUser().getId(), budget.getCategory().getId(),
                ym.atDay(1), ym.atEndOfMonth());
    }

    private BudgetResponse toResponse(Budget budget) {
        BigDecimal spent = spentForBudget(budget);
        BigDecimal remaining = budget.getLimitAmount().subtract(spent);
        double percentUsed = budget.getLimitAmount().compareTo(BigDecimal.ZERO) > 0
                ? spent.divide(budget.getLimitAmount(), 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0.0;

        return BudgetResponse.builder()
                .id(budget.getId())
                .categoryId(budget.getCategory().getId())
                .categoryName(budget.getCategory().getName())
                .limitAmount(budget.getLimitAmount())
                .spentAmount(spent)
                .remainingAmount(remaining)
                .percentUsed(percentUsed)
                .month(budget.getMonth())
                .year(budget.getYear())
                .build();
    }
}
