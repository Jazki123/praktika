package com.example.review.controller;

import com.example.review.dto.PrepodDto;
import com.example.review.entity.Prepod;
import com.example.review.repository.PrepodRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prepods")
@Tag(name = "Преподаватели")
public class PrepodController {

    @Autowired
    private PrepodRepository repository;

    @GetMapping
    public List<PrepodDto> getAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    @PostMapping
    public PrepodDto create(@RequestBody PrepodDto dto) {
        Prepod p = new Prepod();
        p.setFio(dto.fio);
        p.setKafedra(dto.kafedra);
        Prepod saved = repository.save(p);
        dto.id = saved.getId_prepod();
        return dto;
    }

    private PrepodDto toDto(Prepod p) {
        PrepodDto dto = new PrepodDto();
        dto.id = p.getId_prepod();
        dto.fio = p.getFio();
        dto.kafedra = p.getKafedra();
        return dto;
    }
}