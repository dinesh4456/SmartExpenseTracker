package com.expensetracker.controller;

import java.io.ByteArrayInputStream;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.service.ReportService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/reports")
@Tag(
        name = "Report APIs",
        description = "Expense Reports"
)
public class ReportController {

    private final ReportService reportService;

    public ReportController(
            ReportService reportService) {

        this.reportService = reportService;
    }

    // =========================================================
    // MONTHLY REPORT
    // =========================================================

    @Operation(summary = "Monthly Expense Report")
    @GetMapping("/monthly")
    public Object getMonthlyReport(

            @RequestParam(required = false)
            Integer year,

            @RequestParam(required = false)
            Integer month) {

        return reportService.getMonthlyReport(year, month);
    }

    // =========================================================
    // OLD EXPENSE EXCEL
    // =========================================================

    @Operation(summary = "Export Expense Excel Report")
    @GetMapping("/export/excel")
    public ResponseEntity<InputStreamResource> exportExcel() {

        ByteArrayInputStream file =
                reportService.exportExpensesToExcel();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=expenses.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(file));
    }

    // =========================================================
    // MONTHLY FINANCIAL EXCEL
    // =========================================================

    @Operation(summary = "Export Monthly Financial Excel Report")
    @GetMapping("/export/monthly-excel")
    public ResponseEntity<InputStreamResource> exportMonthlyExcel(

            @RequestParam(required = false)
            Integer year,

            @RequestParam(required = false)
            Integer month) {

        ByteArrayInputStream file =
                reportService.exportMonthlyReportToExcel(
                        year,
                        month
                );

        String fileName;

        if (month == null || month == 0) {

            fileName = "financial-report.xlsx";

        } else {

            fileName =
                    "financial-report-"
                            + year
                            + "-"
                            + month
                            + ".xlsx";
        }

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + fileName)
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(file));
    }

    // =========================================================
    // MONTHLY FINANCIAL PDF
    // =========================================================

    @Operation(summary = "Export Monthly Financial PDF Report")
    @GetMapping("/export/monthly-pdf")
    public ResponseEntity<InputStreamResource> exportMonthlyPdf(

            @RequestParam(required = false)
            Integer year,

            @RequestParam(required = false)
            Integer month) {

        ByteArrayInputStream file =
                reportService.exportMonthlyReportToPdf(
                        year,
                        month
                );

        String fileName;

        if (month == null || month == 0) {

            fileName = "financial-report.pdf";

        } else {

            fileName =
                    "financial-report-"
                            + year
                            + "-"
                            + month
                            + ".pdf";
        }

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + fileName)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(file));
    }

    // =========================================================
    // OLD EXPENSE PDF
    // =========================================================

    @Operation(summary = "Export Expense PDF Report")
    @GetMapping("/export/pdf")
    public ResponseEntity<InputStreamResource> exportPdf() {

        ByteArrayInputStream file =
                reportService.exportExpensesToPdf();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=expenses.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(file));
    }
}