
package com.k12hunar.crm_backend.controller;

import java.util.List;
import com.k12hunar.crm_backend.entity.Inquiry;
import com.k12hunar.crm_backend.service.InquiryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    private final InquiryService inquiryService;

    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @PostMapping
    public ResponseEntity<Inquiry> createInquiry(
            @Valid @RequestBody Inquiry inquiry) {

        Inquiry savedInquiry = inquiryService.createInquiry(inquiry);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedInquiry);
    }

    @GetMapping
    public ResponseEntity<List<Inquiry>> getAllInquiries(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String userType,
            @RequestParam(required = false) String search) {

        return ResponseEntity.ok(
                inquiryService.searchInquiries(category, userType, search));
    }

    @org.springframework.web.bind.annotation.PatchMapping("/{id}/status")
    public org.springframework.http.ResponseEntity<?> updateStatus(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestParam String status) {

        return org.springframework.http.ResponseEntity.ok(
                inquiryService.updateStatus(id, status.toUpperCase()));
    }

}
