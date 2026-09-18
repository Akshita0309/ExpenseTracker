package com.expensetracker.scheduler;

import com.expensetracker.service.AlertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class BudgetAlertScheduler {

    private final AlertService alertService;

    /**
     * Runs once a day at 07:00 server time and re-checks every active budget,
     * generating alerts for any category that has crossed 90% of its limit or
     * gone over budget for the current month.
     */
    @Scheduled(cron = "0 0 7 * * *")
    public void runDailyBudgetCheck() {
        log.info("Running scheduled daily budget alert check");
        alertService.runBudgetCheckForAllUsers();
        log.info("Completed scheduled daily budget alert check");
    }
}
