package com.example.review.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "course")
@Data
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_Course;

    private String title;
    private String facult;

    @ManyToOne
    @JoinColumn(name = "id_prepod")
    private Prepod prepod;
}