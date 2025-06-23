package com.example.review.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "otzyv")
@Data
public class Otzyv {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_otzyv;

    private String text;
    private Integer grates;
    private LocalDate date_otzyv;

    @ManyToOne
    @JoinColumn(name = "id_student")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "id_prepod")
    private Prepod prepod;

    @ManyToOne
    @JoinColumn(name = "id_Course")
    private Course course;
}
