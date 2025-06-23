package com.example.review.controller;

import com.example.review.dto.ReviewDto;
import com.example.review.entity.*;
import com.example.review.repository.OtzyvRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Отзывы", description = "Операции с отзывами")
public class ReviewController {

    @Autowired
    private OtzyvRepository repository;

    @GetMapping
    @Operation(summary = "Получить все отзывы")
    public List<ReviewDto> getAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    @PostMapping
    @Operation(summary = "Добавить отзыв")
    public ReviewDto create(@RequestBody ReviewDto dto) {
        Otzyv entity = new Otzyv();
        entity.setText(dto.text);
        entity.setGrates(dto.grates);
        entity.setDate_otzyv(dto.date_otzyv);

        Student student = new Student();
        student.setId_student(dto.studentId);
        entity.setStudent(student);

        Prepod prepod = new Prepod();
        prepod.setId_prepod(dto.prepodId);
        entity.setPrepod(prepod);

        Course course = new Course();
        course.setId_Course(dto.courseId);
        entity.setCourse(course);

        Otzyv saved = repository.save(entity);
        dto.id = saved.getId_otzyv();
        return dto;
    }

    private ReviewDto toDto(Otzyv entity) {
        ReviewDto dto = new ReviewDto();
        dto.id = entity.getId_otzyv();
        dto.text = entity.getText();
        dto.grates = entity.getGrates();
        dto.date_otzyv = entity.getDate_otzyv();
        dto.studentId = entity.getStudent().getId_student();
        dto.prepodId = entity.getPrepod().getId_prepod();
        dto.courseId = entity.getCourse().getId_Course();
        return dto;
    }
}