package com.k12hunar.crm_backend;

import com.k12hunar.crm_backend.entity.Admin;
import com.k12hunar.crm_backend.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeeder {

    @Bean
    CommandLineRunner seedAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            String email = System.getenv("ADMIN_EMAIL");
            String password = System.getenv("ADMIN_PASSWORD");

            if (email == null || email.isBlank()
                    || password == null || password.isBlank()) {
                System.out.println(
                    "Admin seeding skipped: ADMIN_EMAIL/ADMIN_PASSWORD not set."
                );
                return;
            }

            if (adminRepository.findByEmail(email.trim()).isPresent()) {
                System.out.println("Admin already exists.");
                return;
            }

            Admin admin = new Admin();
            admin.setEmail(email.trim());
            admin.setPasswordHash(passwordEncoder.encode(password));

            adminRepository.save(admin);
            System.out.println("Initial admin created successfully.");
        };
    }
}