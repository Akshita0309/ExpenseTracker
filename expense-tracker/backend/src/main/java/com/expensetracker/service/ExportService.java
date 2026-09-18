package com.expensetracker.service;

import java.io.ByteArrayOutputStream;

public interface ExportService {
    ByteArrayOutputStream exportTransactionsToPdf(Long userId, Integer month, Integer year);
    ByteArrayOutputStream exportTransactionsToExcel(Long userId, Integer month, Integer year);
}
