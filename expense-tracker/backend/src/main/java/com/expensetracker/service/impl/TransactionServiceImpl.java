package com.expensetracker.service.impl;

import com.expensetracker.dto.request.TransactionRequest;
import com.expensetracker.dto.response.TransactionResponse;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.Transaction;
import com.expensetracker.entity.User;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.TransactionRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.BudgetService;
import com.expensetracker.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final BudgetService budgetService;

    @Override
    @Transactional
    public TransactionResponse create(Long userId, TransactionRequest request) {
        Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        User user = userRepository.getReferenceById(userId);

        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .type(request.getType())
                .description(request.getDescription())
                .transactionDate(request.getTransactionDate())
                .category(category)
                .user(user)
                .build();

        Transaction saved = transactionRepository.save(transaction);

        if (saved.getType() == Transaction.TransactionType.EXPENSE) {
            budgetService.checkAndTriggerAlert(userId, category.getId(),
                    saved.getTransactionDate().getMonthValue(), saved.getTransactionDate().getYear());
        }

        return toResponse(saved);
    }

    @Override
    public List<TransactionResponse> getAll(Long userId, LocalDate startDate, LocalDate endDate, Long categoryId) {
        List<Transaction> transactions;
        if (startDate != null && endDate != null) {
            transactions = transactionRepository.findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
                    userId, startDate, endDate);
        } else {
            transactions = transactionRepository.findByUserIdOrderByTransactionDateDesc(userId);
        }

        if (categoryId != null) {
            transactions = transactions.stream()
                    .filter(t -> t.getCategory().getId().equals(categoryId))
                    .toList();
        }

        return transactions.stream().map(this::toResponse).toList();
    }

    @Override
    public TransactionResponse getById(Long userId, Long id) {
        Transaction transaction = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        return toResponse(transaction);
    }

    @Override
    @Transactional
    public TransactionResponse update(Long userId, Long id, TransactionRequest request) {
        Transaction transaction = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setCategory(category);

        Transaction saved = transactionRepository.save(transaction);

        if (saved.getType() == Transaction.TransactionType.EXPENSE) {
            budgetService.checkAndTriggerAlert(userId, category.getId(),
                    saved.getTransactionDate().getMonthValue(), saved.getTransactionDate().getYear());
        }

        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long userId, Long id) {
        Transaction transaction = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        transactionRepository.delete(transaction);
    }

    private TransactionResponse toResponse(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .amount(t.getAmount())
                .type(t.getType())
                .description(t.getDescription())
                .transactionDate(t.getTransactionDate())
                .categoryId(t.getCategory().getId())
                .categoryName(t.getCategory().getName())
                .categoryColor(t.getCategory().getColor())
                .build();
    }
}
