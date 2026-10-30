
package com.k12hunar.crm_backend.repository;

import com.k12hunar.crm_backend.entity.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    @Query("""
        SELECT i FROM Inquiry i
        WHERE (:category = '' OR i.category = :category)
          AND (:userType = '' OR i.userType = :userType)
          AND (
              :search = ''
              OR LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%'))
              OR i.phone LIKE CONCAT('%', :search, '%')
          )
        ORDER BY i.createdAt DESC
        """)
    List<Inquiry> searchInquiries(
            @Param("category") String category,
            @Param("userType") String userType,
            @Param("search") String search
    );
}
