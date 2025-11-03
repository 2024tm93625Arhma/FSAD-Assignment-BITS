package com.auth.security;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth.service.CustomUserDetailsService;

@Configuration

@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
    private JwtAuthFilter jwtAuthFilter ;
    @Autowired
    private CustomUserDetailsService userDetailsService ;

   
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeHttpRequests()
            // ✅ Public routes (no token needed)
            .requestMatchers("/api/users/login", "/api/users/signup").permitAll()
            

            // ✅ Role-based protected routes
            .requestMatchers("/api/users/**").hasRole("ADMIN")  // only ADMIN can access user management
            .requestMatchers("/api/equipment/**").hasAnyRole("ADMIN", "STAFF")
            .requestMatchers("/api/requests/**").hasAnyRole("STUDENT", "STAFF", "ADMIN")

            // ✅ All others require authentication
            .anyRequest().authenticated()

            .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
