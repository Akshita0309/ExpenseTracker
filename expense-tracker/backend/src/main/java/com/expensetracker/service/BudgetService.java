package com.expensetracker.service;

import com.expensetracker.dto.request.BudgetRequest;
import com.expensetracker.dto.response.BudgetResponse;

import java.util.List;

public interface BudgetService {
    BudgetResponse create(Long userId, BudgetRequest request);
    List<BudgetResponse> getAll(Long userId, Integer month, Integer year);
    BudgetResponse update(Long userId, Long id, BudgetRequest request);
    void delete(Long userId, Long id);

    /** Checks a single category's budget usage and creates an Alert if the threshold is crossed. */
    void checkAndTriggerAlert(Long userId, Long categoryId, Integer month, Integer year);
}
