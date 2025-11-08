package com.auth.security;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth.service.CustomUserDetailsService;

@Configuration
@EnableMethodSecurity // Ensures @PreAuthorize on controllers is used
public class SecurityConfig {
    @Autowired
    private JwtAuthFilter jwtAuthFilter ;
    @Autowired
    private CustomUserDetailsService userDetailsService ;

   
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // ✅ Public routes (no token needed)
                .requestMatchers("/api/users/login", "/api/users/signup").permitAll()
                
                // ✅ User management (Admin Only)
                .requestMatchers("/api/users/**").hasRole("ADMIN")

                // ✅ Equipment: Authenticated users can view. Admin only can modify.
                .requestMatchers(HttpMethod.GET, "/api/equipment", "/api/equipment/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/equipment").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/equipment/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/equipment/**").hasRole("ADMIN")

                // ✅ Borrowing: Authenticated users only. Specific roles are checked at the controller level.
                .requestMatchers("/api/borrow/**").authenticated()

                // ✅ All others require authentication
                .anyRequest().authenticated()
            )
            // ✅ Use Stateless session management for JWT
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
