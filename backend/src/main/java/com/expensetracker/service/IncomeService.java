package com.expensetracker.service;

import java.util.List;

import com.expensetracker.entity.Income;

public interface IncomeService {

    Income saveIncome(Income income);

    List<Income> getAllIncome();

    Income getIncomeById(Long id);

    Income updateIncome(Long id, Income income);

    void deleteIncome(Long id);

}