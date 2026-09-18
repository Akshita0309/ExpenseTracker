package com.expensetracker.service.impl;

import com.expensetracker.dto.response.ReportResponse;
import com.expensetracker.repository.TransactionRepository;
import com.expensetracker.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final TransactionRepository transactionRepository;

    @Override
    public ReportResponse getMonthlyReport(Long userId, Integer month, Integer year) {
        int m = month != null ? month : LocalDate.now().getMonthValue();
        int y = year != null ? year : LocalDate.now().getYear();
        YearMonth ym = YearMonth.of(y, m);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        BigDecimal totalIncome = transactionRepository.sumIncomeBetween(userId, start, end);
        BigDecimal totalExpense = transactionRepository.sumExpenseBetween(userId, start, end);
        BigDecimal netSavings = totalIncome.subtract(totalExpense);

        List<Object[]> grouped = transactionRepository.sumExpenseGroupedByCategory(userId, start, end);
        List<ReportResponse.CategoryBreakdown> breakdown = grouped.stream()
                .map(row -> {
                    Long categoryId = (Long) row[0];
                    String categoryName = (String) row[1];
                    BigDecimal amount = (BigDecimal) row[2];
                    double percentage = totalExpense.compareTo(BigDecimal.ZERO) > 0
                            ? amount.divide(totalExpense, 4, RoundingMode.HALF_UP).doubleValue() * 100
                            : 0.0;
                    return ReportResponse.CategoryBreakdown.builder()
                            .categoryId(categoryId)
                            .categoryName(categoryName)
                            .amount(amount)
                            .percentage(percentage)
                            .build();
                })
                .toList();

        return ReportResponse.builder()
                .month(m)
                .year(y)
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netSavings(netSavings)
                .categoryBreakdown(breakdown)
                .build();
    }
}
