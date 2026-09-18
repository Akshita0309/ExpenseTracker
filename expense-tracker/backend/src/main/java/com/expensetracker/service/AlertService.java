package com.expensetracker.service;

import com.expensetracker.dto.response.AlertResponse;

import java.util.List;

public interface AlertService {
    List<AlertResponse> getAll(Long userId);
    AlertResponse markAsRead(Long userId, Long id);
    void runBudgetCheckForAllUsers();
}
