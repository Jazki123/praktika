package com.example.review.controller;

import com.example.review.dto.CourseDto;
import com.example.review.entity.Course;
import com.example.review.entity.Prepod;
import com.example.review.repository.CourseRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@Tag(name = "Курсы")
public class CourseController {

    @Autowired
    private CourseRepository repository;

    @GetMapping
    public List<CourseDto> getAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    @PostMapping
    public CourseDto create(@RequestBody CourseDto dto) {
        Course c = new Course();
        c.setTitle(dto.title);
        c.setFacult(dto.facult);
        Prepod prepod = new Prepod();
        prepod.setId_prepod(dto.prepodId);
        c.setPrepod(prepod);
        Course saved = repository.save(c);
        dto.id = saved.getId_Course();
        return dto;
    }

    private CourseDto toDto(Course c) {
        CourseDto dto = new CourseDto();
        dto.id = c.getId_Course();
        dto.title = c.getTitle();
        dto.facult = c.getFacult();
        dto.prepodId = c.getPrepod().getId_prepod();
        return dto;
    }
}