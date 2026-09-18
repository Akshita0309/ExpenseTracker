package com.expensetracker.service;

import com.expensetracker.dto.request.CategoryRequest;
import com.expensetracker.dto.response.CategoryResponse;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.User;
import com.expensetracker.exception.BadRequestException;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    private CategoryService categoryService;

    @BeforeEach
    void setUp() {
        categoryService = new CategoryServiceImpl(categoryRepository, userRepository);
    }

    @Test
    void create_savesCategory_whenNameIsUnique() {
        Long userId = 1L;
        CategoryRequest request = new CategoryRequest("Groceries", Category.CategoryType.EXPENSE, "#00FF00");
        User user = User.builder().id(userId).build();

        when(categoryRepository.existsByNameAndUserIdAndType("Groceries", userId, Category.CategoryType.EXPENSE))
                .thenReturn(false);
        when(userRepository.getReferenceById(userId)).thenReturn(user);
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> {
            Category c = invocation.getArgument(0);
            c.setId(10L);
            return c;
        });

        CategoryResponse response = categoryService.create(userId, request);

        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getName()).isEqualTo("Groceries");
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void create_throwsBadRequest_whenDuplicateNameAndType() {
        Long userId = 1L;
        CategoryRequest request = new CategoryRequest("Groceries", Category.CategoryType.EXPENSE, "#00FF00");

        when(categoryRepository.existsByNameAndUserIdAndType("Groceries", userId, Category.CategoryType.EXPENSE))
                .thenReturn(true);

        assertThatThrownBy(() -> categoryService.create(userId, request))
                .isInstanceOf(BadRequestException.class);

        verify(categoryRepository, never()).save(any());
    }
}
