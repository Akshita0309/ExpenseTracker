package com.expensetracker.controller;

import com.expensetracker.dto.request.BudgetRequest;
import com.expensetracker.dto.response.BudgetResponse;
import com.expensetracker.security.UserPrincipal;
import com.expensetracker.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<BudgetResponse> create(@AuthenticationPrincipal UserPrincipal user,
                                                   @Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(budgetService.create(user.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getAll(@AuthenticationPrincipal UserPrincipal user,
                                                         @RequestParam(required = false) Integer month,
                                                         @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(budgetService.getAll(user.getId(), month, year));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponse> update(@AuthenticationPrincipal UserPrincipal user,
                                                   @PathVariable Long id,
                                                   @Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.update(user.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserPrincipal user, @PathVariable Long id) {
        budgetService.delete(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
