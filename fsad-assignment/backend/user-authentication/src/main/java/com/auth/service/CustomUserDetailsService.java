package com.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.auth.entity.User;
import com.auth.repository.UserRepository;
import com.auth.security.CustomUserDetails;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository repo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole());

        // Return your custom user details that includes the user ID
        return new CustomUserDetails(user, Collections.singletonList(authority));
    }
}
