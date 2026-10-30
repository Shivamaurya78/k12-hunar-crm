
package com.k12hunar.crm_backend.controller;

import com.k12hunar.crm_backend.dto.LoginRequest;
import com.k12hunar.crm_backend.dto.LoginResponse;
import com.k12hunar.crm_backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
