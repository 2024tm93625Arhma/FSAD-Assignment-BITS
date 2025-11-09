package com.auth.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // <-- IMPORT
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration; // <-- IMPORT
import org.springframework.web.cors.CorsConfigurationSource; // <-- IMPORT
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // <-- IMPORT
import java.util.List; // <-- IMPORT
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
        http.csrf(csrf -> csrf.disable())
            // --- 1. ENABLE CORS AT THE SECURITY LEVEL ---
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            .authorizeHttpRequests(auth -> auth
                // --- 2. ALLOW ALL PREFLIGHT OPTIONS REQUESTS ---
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                
                // --- 3. RE-DEFINE YOUR EXISTING RULES ---
                .requestMatchers("/api/users/login", "/api/users/signup").permitAll()
                
                // Equipment Rules
                .requestMatchers(HttpMethod.GET, "/api/equipment", "/api/equipment/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/equipment").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/equipment/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/equipment/**").hasRole("ADMIN")

                // User Management Rules
                .requestMatchers("/api/users/**").hasRole("ADMIN")  

                // Borrow Rules
                .requestMatchers("/api/borrow/**").authenticated()

                // All others
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // --- 4. ADD THIS BEAN TO DEFINE YOUR CORS CONFIG ---
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // This is the origin of your React app
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        // These are the methods you want to allow
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // These are the headers you want to allow
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        // This allows cookies/credentials to be sent
        config.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this config to all paths
        source.registerCorsConfiguration("/**", config);
        return source;
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}