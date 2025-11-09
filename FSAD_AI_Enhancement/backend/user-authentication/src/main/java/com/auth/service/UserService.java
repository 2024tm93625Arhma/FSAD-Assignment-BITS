package com.auth.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.auth.dto.SignupRequest;
import com.auth.entity.User;
import com.auth.repository.UserRepository;


@Service

public class UserService {
	@Autowired
    private  UserRepository repo;
	@Autowired
    private  JwtService jwtService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

//    public String signup(User user) {
//        user.setPassword(encoder.encode(user.getPassword()));
//        repo.save(user);
//        return jwtService.generateToken(user.getEmail(), user.getRole());
//    }
  

    public String signup(SignupRequest request) {
        if (repo.existsByEmail(request.getEmail())) {
            throw(new RuntimeException("Invalid email or password"));
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        repo.save(user);
        return jwtService.generateToken(user.getEmail(), user.getName(), user.getRole());

    }


    public String login(String email, String password) {
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtService.generateToken(user.getEmail(), user.getName(), user.getRole());

    }


    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public User getUserById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long id, User updatedUser) {
        User existing = getUserById(id);
        existing.setName(updatedUser.getName());
        existing.setRole(updatedUser.getRole());
        return repo.save(existing);
    }

    public void deleteUser(Long id) {
        repo.deleteById(id);
    }
}
