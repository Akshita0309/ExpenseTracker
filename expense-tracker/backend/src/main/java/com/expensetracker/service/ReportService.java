package com.expensetracker.service;

import com.expensetracker.dto.response.ReportResponse;

public interface ReportService {
    ReportResponse getMonthlyReport(Long userId, Integer month, Integer year);
}
