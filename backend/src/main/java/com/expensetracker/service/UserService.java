package com.expensetracker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.expensetracker.dto.user.UserResponse;
import com.expensetracker.entity.User;

public interface UserService {

    User saveUser(User user);

    List<User> getAllUsers();

    Optional<User> getUserById(Long id);

    void deleteUser(Long id);

    UserResponse uploadProfileImage(MultipartFile file);
}