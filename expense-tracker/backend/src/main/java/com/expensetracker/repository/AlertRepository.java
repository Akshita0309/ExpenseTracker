package com.expensetracker.repository;

import com.expensetracker.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByUserIdOrderByCreatedAtDesc(Long userId);
    boolean existsByBudgetIdAndMessage(Long budgetId, String message);
}
