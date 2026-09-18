package com.expensetracker.controller;

import com.expensetracker.dto.response.ReportResponse;
import com.expensetracker.security.UserPrincipal;
import com.expensetracker.service.ExportService;
import com.expensetracker.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final ExportService exportService;

    @GetMapping("/monthly")
    public ResponseEntity<ReportResponse> monthly(@AuthenticationPrincipal UserPrincipal user,
                                                    @RequestParam(required = false) Integer month,
                                                    @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(reportService.getMonthlyReport(user.getId(), month, year));
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf(@AuthenticationPrincipal UserPrincipal user,
                                             @RequestParam(required = false) Integer month,
                                             @RequestParam(required = false) Integer year) {
        ByteArrayOutputStream out = exportService.exportTransactionsToPdf(user.getId(), month, year);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions-report.pdf")
                .body(out.toByteArray());
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel(@AuthenticationPrincipal UserPrincipal user,
                                               @RequestParam(required = false) Integer month,
                                               @RequestParam(required = false) Integer year) {
        ByteArrayOutputStream out = exportService.exportTransactionsToExcel(user.getId(), month, year);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions-report.xlsx")
                .body(out.toByteArray());
    }
}
