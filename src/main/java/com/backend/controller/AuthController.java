package com.backend.controller;

import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.config.JwtUtil;
import com.backend.dto.LoginRequest;
import com.backend.dto.MailRequest;
import com.backend.dto.RegisterRequest;
import com.backend.service.EmailService;
import com.backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
private UserService userService;
	@Autowired
private JwtUtil jwtUtil;
	@Autowired
private AuthenticationManager authManager;
	
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest req)
{
	  try {
          userService.registerUser(req);
          return ResponseEntity.ok(Map.of("message", "User registered successfully"));
      } catch (RuntimeException e) {
          return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
      }
}

@Autowired
private EmailService emailService;
@PostMapping("/send")
public ResponseEntity<String> sendMail(@RequestBody MailRequest request) {
    // Check if data is actually arriving
    System.out.println("Sending to: " + request.getTo());
    System.out.println("Subject: " + request.getSubject());
    System.out.println("Message: " + request.getMessage());

    emailService.sendEmail(request.getTo(), request.getSubject(), request.getMessage());
    return ResponseEntity.ok("Email sent successfully!");
}
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    try {
        // Authenticate username + password
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        // If authentication passes, generate a JWT
        String token = jwtUtil.generateToken(request.getUsername());
        return ResponseEntity.ok(Map.of("token", token, "username", request.getUsername()));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid username or password"));
    }
}
}
