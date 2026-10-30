package com.k12hunar.crm_backend.dto;

public record LoginRequest(
        String email,
        String password
) {
}