package com.k12hunar.crm_backend.dto;

public record LoginResponse(
        String token,
        String tokenType
) {
}