package com.backend.service;

import com.backend.dto.RegisterRequest;
import com.backend.model.Account;
import com.backend.model.User;
import com.backend.repository.AccountRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service   // Marks this as a business logic layer bean
public class UserService implements UserDetailsService {
    // UserDetailsService is required by Spring Security to load users

    @Autowired private UserRepository userRepository;
    @Autowired private AccountRepository accountRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // Called by Spring Security during login to fetch the user
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Wrap in Spring Security's User object
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().replace("ROLE_", ""))
                .build();
    }

    // Register a new user and auto-create an account
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setAge(request.getAge());
        user.setContact(request.getContact());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Hash the password
        userRepository.save(user);

        // Auto-create a savings account with $1000 starting balance
        Account account = new Account();
        account.setAccountNumber("ACC" + (1000 + userRepository.count()));
        account.setCisfNumber( (long)(Math.floor(100000 + Math.random() * 900000)));
        account.setBalance(new BigDecimal("1000"));
        account.setAccountType("SAVINGS");
        account.setUser(user);
        accountRepository.save(account);

        return user;
    }
} 