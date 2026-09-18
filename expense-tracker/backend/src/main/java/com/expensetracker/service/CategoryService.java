package com.expensetracker.service;

import com.expensetracker.dto.request.CategoryRequest;
import com.expensetracker.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse create(Long userId, CategoryRequest request);
    List<CategoryResponse> getAll(Long userId);
    CategoryResponse update(Long userId, Long id, CategoryRequest request);
    void delete(Long userId, Long id);
}
