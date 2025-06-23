package com.example.review.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "prepod")
@Data
public class Prepod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_prepod;

    private String fio;
    private String kafedra;
}