package com.auth.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth.dto.LoginRequest;
import com.auth.dto.SignupRequest;
import com.auth.entity.User;
import com.auth.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService ;

    // 🟢 Signup: open for all users
    @PostMapping("/signup")
    @PreAuthorize("isAnonymous() or permitAll()")
    public Map<String, String> signup(@RequestBody SignupRequest signupRequest) {
        String token = userService.signup(signupRequest);
        return Map.of("token", token);
    }

    // 🟢 Login: open for all users
    @PostMapping("/login")
    @PreAuthorize("isAnonymous() or permitAll()")
    public Map<String, String> login(@RequestBody LoginRequest loginRequest) {
        String token = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        return Map.of("token", token);
    }

    // 🟡 Get all users — only ADMIN can access
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAll() {
        return userService.getAllUsers();
    }

    // 🟠 Get user by ID — ADMIN or STAFF can view
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public User getById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // 🟣 Update user — ADMIN only
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public User update(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    // 🔴 Delete user — ADMIN only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
