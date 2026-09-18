package com.expensetracker.controller;

import com.expensetracker.dto.response.AlertResponse;
import com.expensetracker.security.UserPrincipal;
import com.expensetracker.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public ResponseEntity<List<AlertResponse>> getAll(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(alertService.getAll(user.getId()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<AlertResponse> markAsRead(@AuthenticationPrincipal UserPrincipal user, @PathVariable Long id) {
        return ResponseEntity.ok(alertService.markAsRead(user.getId(), id));
    }
}
