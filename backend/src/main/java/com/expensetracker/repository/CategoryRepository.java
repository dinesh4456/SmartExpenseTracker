package com.expensetracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expensetracker.entity.Category;
import com.expensetracker.entity.User;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUser(User user);

    Optional<Category> findByUserAndNameIgnoreCase(User user, String name);

    Optional<Category> findByUserAndNameIgnoreCaseAndIdNot(User user, String name, Long id);

    List<Category> findByUserOrderByNameAsc(User user);

    List<Category> findByUserOrderByNameDesc(User user);

    List<Category> findByUserOrderByCreatedAtDesc(User user);

    List<Category> findByUserOrderByCreatedAtAsc(User user);

    List<Category> findByUserAndNameContainingIgnoreCase(User user, String query);

}