package com.expensetracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.expensetracker.entity.Income;
import com.expensetracker.entity.User;

public interface IncomeRepository
        extends JpaRepository<Income, Long> {

    List<Income> findByUser(User user);

    /*
     * Used for Dashboard & Reports
     */
    @Query("""
        SELECT
            MONTH(i.incomeDate),
            SUM(i.amount)
        FROM Income i
        WHERE i.user = :user
        GROUP BY MONTH(i.incomeDate)
        ORDER BY MONTH(i.incomeDate)
        """)
    List<Object[]> getMonthlyIncome(User user);

    /*
     * NEW
     * Returns monthly income for a selected year.
     */
    @Query("""
        SELECT
            MONTH(i.incomeDate),
            SUM(i.amount)
        FROM Income i
        WHERE i.user = :user
          AND YEAR(i.incomeDate) = :year
        GROUP BY MONTH(i.incomeDate)
        ORDER BY MONTH(i.incomeDate)
        """)
    List<Object[]> getMonthlyIncome(
            User user,
            Integer year
    );

    /*
     * NEW
     * Returns all income transactions of the selected
     * year and month.
     */
    @Query("""
        SELECT i
        FROM Income i
        WHERE i.user = :user
          AND YEAR(i.incomeDate) = :year
          AND MONTH(i.incomeDate) = :month
        ORDER BY i.incomeDate ASC
        """)
    List<Income> getIncomeByMonth(
            User user,
            Integer year,
            Integer month
    );

    @Query("""
        SELECT i
        FROM Income i
        WHERE i.user = :user
          AND YEAR(i.incomeDate) = :year
        ORDER BY i.incomeDate ASC
        """)
    List<Income> getIncomeByYear(
            User user,
            Integer year
    );

    @Query("""
        SELECT i
        FROM Income i
        WHERE i.user = :user
          AND MONTH(i.incomeDate) = :month
        ORDER BY i.incomeDate ASC
        """)
    List<Income> getIncomeByMonthOnly(
            User user,
            Integer month
    );

}