package com.example.review.controller;

import com.example.review.dto.StudentDto;
import com.example.review.entity.Student;
import com.example.review.repository.StudentRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@Tag(name = "Студенты")
public class StudentController {

    @Autowired
    private StudentRepository repository;

    @GetMapping
    public List<StudentDto> getAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    @PostMapping
    public StudentDto create(@RequestBody StudentDto dto) {
        Student student = new Student();
        Student saved = repository.save(student);
        dto.id = saved.getId_student();
        return dto;
    }

    private StudentDto toDto(Student s) {
        StudentDto dto = new StudentDto();
        dto.id = s.getId_student();
        return dto;
    }
}