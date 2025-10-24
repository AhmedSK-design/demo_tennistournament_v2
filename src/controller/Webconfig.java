package com.example.roundrobintunier.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Gilt für alle Endpunkte unter /api/
                .allowedOrigins("http://localhost:3000") // Erlaube Anfragen von deinem Frontend (passe Port an!)
                .allowedMethods("POST")
                .allowCredentials(true);
    }
}