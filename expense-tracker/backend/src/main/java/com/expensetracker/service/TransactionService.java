package com.expensetracker.service;

import com.expensetracker.dto.request.TransactionRequest;
import com.expensetracker.dto.response.TransactionResponse;

import java.time.LocalDate;
import java.util.List;

public interface TransactionService {
    TransactionResponse create(Long userId, TransactionRequest request);
    List<TransactionResponse> getAll(Long userId, LocalDate startDate, LocalDate endDate, Long categoryId);
    TransactionResponse getById(Long userId, Long id);
    TransactionResponse update(Long userId, Long id, TransactionRequest request);
    void delete(Long userId, Long id);
}
