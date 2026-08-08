package com.expensetracker.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.expensetracker.dto.report.MonthlyExpenseProjection;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    Page<Expense> findByUser(
            User user,
            Pageable pageable
    );

    List<Expense> findByUser(User user);

    List<Expense> findByUserAndTitleContainingIgnoreCase(
            User user,
            String title
    );

    List<Expense> findByUserAndExpenseDateBetween(
            User user,
            LocalDate startDate,
            LocalDate endDate
    );

    boolean existsByCategory(com.expensetracker.entity.Category category);

    long countByCategory(com.expensetracker.entity.Category category);

    List<Expense> findByCategory(com.expensetracker.entity.Category category);

    @Query("""
        SELECT
            MONTH(e.expenseDate) AS month,
            SUM(e.amount) AS totalExpense
        FROM Expense e
        WHERE e.user = :user
        GROUP BY MONTH(e.expenseDate)
        ORDER BY MONTH(e.expenseDate)
        """)
    List<MonthlyExpenseProjection> getMonthlyExpense(User user);

    @Query("""
        SELECT
            MONTH(e.expenseDate) AS month,
            SUM(e.amount) AS totalExpense
        FROM Expense e
        WHERE e.user = :user
          AND YEAR(e.expenseDate) = :year
        GROUP BY MONTH(e.expenseDate)
        ORDER BY MONTH(e.expenseDate)
        """)
    List<MonthlyExpenseProjection> getMonthlyExpense(User user, Integer year);

    @Query("""
        SELECT
            c.name,
            SUM(e.amount)
        FROM Expense e
        JOIN e.category c
        WHERE e.user = :user
        GROUP BY c.name
        ORDER BY SUM(e.amount) DESC
        """)
    List<Object[]> getCategoryWiseExpense(User user);

    @Query("""
        SELECT
            c.name,
            SUM(e.amount)
        FROM Expense e
        JOIN e.category c
        WHERE e.user = :user
          AND YEAR(e.expenseDate) = :year
          AND MONTH(e.expenseDate) = :month
        GROUP BY c.name
        ORDER BY SUM(e.amount) DESC
        """)
    List<Object[]> getCategoryWiseExpenseByMonth(
            User user,
            Integer year,
            Integer month
    );

    /*
     * Returns expenses of a selected year and month.
     */
    @Query("""
        SELECT e
        FROM Expense e
        WHERE e.user = :user
          AND YEAR(e.expenseDate) = :year
          AND MONTH(e.expenseDate) = :month
        ORDER BY e.expenseDate ASC
        """)
    List<Expense> getExpensesByMonth(
            User user,
            Integer year,
            Integer month
    );

    @Query("""
        SELECT e
        FROM Expense e
        WHERE e.user = :user
          AND YEAR(e.expenseDate) = :year
        ORDER BY e.expenseDate ASC
        """)
    List<Expense> getExpensesByYear(
            User user,
            Integer year
    );

    @Query("""
        SELECT e
        FROM Expense e
        WHERE e.user = :user
          AND MONTH(e.expenseDate) = :month
        ORDER BY e.expenseDate ASC
        """)
    List<Expense> getExpensesByMonthOnly(
            User user,
            Integer month
    );

    @Query("""
        SELECT e
        FROM Expense e
        WHERE e.user = :user
        ORDER BY e.expenseDate DESC, e.id DESC
        """)
    List<Expense> findRecentByUser(User user, Pageable pageable);

    @Query("""
        SELECT e
        FROM Expense e
        WHERE e.user = :user
          AND e.expenseDate >= :startDate
        ORDER BY e.expenseDate DESC, e.id DESC
        """)
    List<Expense> findRecentByUserAndDateAfter(User user, LocalDate startDate);

}