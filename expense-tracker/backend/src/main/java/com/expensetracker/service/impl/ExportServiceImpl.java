package com.expensetracker.service.impl;

import com.expensetracker.entity.Transaction;
import com.expensetracker.repository.TransactionRepository;
import com.expensetracker.service.ExportService;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportServiceImpl implements ExportService {

    private final TransactionRepository transactionRepository;

    private List<Transaction> fetchTransactions(Long userId, Integer month, Integer year) {
        int m = month != null ? month : LocalDate.now().getMonthValue();
        int y = year != null ? year : LocalDate.now().getYear();
        YearMonth ym = YearMonth.of(y, m);
        return transactionRepository.findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
                userId, ym.atDay(1), ym.atEndOfMonth());
    }

    @Override
    public ByteArrayOutputStream exportTransactionsToPdf(Long userId, Integer month, Integer year) {
        List<Transaction> transactions = fetchTransactions(userId, month, year);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            com.lowagie.text.Font titleFont = new com.lowagie.text.Font(
                    com.lowagie.text.Font.HELVETICA, 16, com.lowagie.text.Font.BOLD);
            Paragraph title = new Paragraph("Expense Tracker - Transaction Report", titleFont);
            title.setSpacingAfter(10f);
            document.add(title);

            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2f, 2f, 3f, 2f, 3f});

            com.lowagie.text.Font pdfHeaderFont = new com.lowagie.text.Font(
                    com.lowagie.text.Font.HELVETICA, 10, com.lowagie.text.Font.BOLD, Color.WHITE);
            String[] headers = {"Date", "Type", "Category", "Amount", "Description"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, pdfHeaderFont));
                cell.setBackgroundColor(new Color(59, 89, 152));
                cell.setPadding(6f);
                table.addCell(cell);
            }

            BigDecimal totalIncome = BigDecimal.ZERO;
            BigDecimal totalExpense = BigDecimal.ZERO;

            for (Transaction t : transactions) {
                table.addCell(t.getTransactionDate().toString());
                table.addCell(t.getType().name());
                table.addCell(t.getCategory().getName());
                table.addCell(t.getAmount().toString());
                table.addCell(t.getDescription() != null ? t.getDescription() : "");

                if (t.getType() == Transaction.TransactionType.INCOME) {
                    totalIncome = totalIncome.add(t.getAmount());
                } else {
                    totalExpense = totalExpense.add(t.getAmount());
                }
            }

            document.add(table);

            Paragraph summary = new Paragraph(
                    "\nTotal Income: " + totalIncome + "\nTotal Expense: " + totalExpense +
                    "\nNet: " + totalIncome.subtract(totalExpense),
                    new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 11, com.lowagie.text.Font.BOLD));
            document.add(summary);

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }

        return out;
    }

    @Override
    public ByteArrayOutputStream exportTransactionsToExcel(Long userId, Integer month, Integer year) {
        List<Transaction> transactions = fetchTransactions(userId, month, year);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Transactions");

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font excelHeaderFont = workbook.createFont();
            excelHeaderFont.setBold(true);
            excelHeaderFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(excelHeaderFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            Row header = sheet.createRow(0);
            String[] columns = {"Date", "Type", "Category", "Amount", "Description"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Transaction t : transactions) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(t.getTransactionDate().toString());
                row.createCell(1).setCellValue(t.getType().name());
                row.createCell(2).setCellValue(t.getCategory().getName());
                row.createCell(3).setCellValue(t.getAmount().doubleValue());
                row.createCell(4).setCellValue(t.getDescription() != null ? t.getDescription() : "");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel report", e);
        }

        return out;
    }
}
