package com.expensetracker.dto.response;

import com.expensetracker.entity.Category;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private Category.CategoryType type;
    private String color;
}
