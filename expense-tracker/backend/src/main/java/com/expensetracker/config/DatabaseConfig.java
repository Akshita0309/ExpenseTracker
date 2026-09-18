package com.expensetracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Central place for cross-cutting persistence/runtime configuration:
 * enables the @Scheduled budget-alert job and @Transactional service methods.
 */
@Configuration
@EnableScheduling
@EnableAsync
@EnableTransactionManagement
public class DatabaseConfig {
}
