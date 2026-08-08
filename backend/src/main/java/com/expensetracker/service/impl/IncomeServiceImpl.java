package com.expensetracker.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.expensetracker.entity.Income;
import com.expensetracker.entity.User;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.IncomeRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.SecurityUtils;
import com.expensetracker.service.IncomeService;

@Service
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    public IncomeServiceImpl(
            IncomeRepository incomeRepository,
            UserRepository userRepository) {

        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Income saveIncome(Income income) {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        income.setUser(user);

        return incomeRepository.save(income);
    }

    @Override
    public List<Income> getAllIncome() {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return incomeRepository.findByUser(user);
    }

    @Override
    public Income getIncomeById(Long id) {

        return incomeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Income not found with id : " + id));
    }

    @Override
    public Income updateIncome(Long id, Income income) {

        Income existing = incomeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Income not found with id : " + id));

        existing.setSource(income.getSource());
        existing.setAmount(income.getAmount());
        existing.setIncomeDate(income.getIncomeDate());

        return incomeRepository.save(existing);
    }

    @Override
    public void deleteIncome(Long id) {

        Income income = incomeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Income not found with id : " + id));

        incomeRepository.delete(income);
    }
}