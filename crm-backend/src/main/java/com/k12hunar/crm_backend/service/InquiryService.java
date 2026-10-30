
package com.k12hunar.crm_backend.service;

import java.util.List;
import com.k12hunar.crm_backend.entity.Inquiry;
import com.k12hunar.crm_backend.repository.InquiryRepository;

import org.springframework.stereotype.Service;

@Service
public class InquiryService {

    private final InquiryRepository inquiryRepository;

    public InquiryService(InquiryRepository inquiryRepository) {
        this.inquiryRepository = inquiryRepository;
    }

    public Inquiry createInquiry(Inquiry inquiry) {

        inquiry.setId(null);
        inquiry.setStatus("NEW");

        return inquiryRepository.save(inquiry);
    }

    public List<Inquiry> getAllInquiries() {
        return inquiryRepository.findAll();
    }

  public List<Inquiry> searchInquiries(
        String category, String userType, String search) {

    category = (category == null) ? "" : category.trim();
    userType = (userType == null) ? "" : userType.trim();
    search = (search == null) ? "" : search.trim();

    return inquiryRepository.searchInquiries(category, userType, search);
}


public com.k12hunar.crm_backend.entity.Inquiry updateStatus(
        Long id, String status) {

    var inquiry = inquiryRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Inquiry not found"));

    var validStatuses = java.util.Set.of(
            "NEW", "CONTACTED", "RESOLVED");

    if (status == null || !validStatuses.contains(status)) {
        throw new IllegalArgumentException("Invalid inquiry status");
    }

    inquiry.setStatus(status);
    return inquiryRepository.save(inquiry);
}


}
