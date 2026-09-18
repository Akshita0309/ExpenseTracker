package com.expensetracker.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertResponse {
    private Long id;
    private Long budgetId;
    private String categoryName;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
