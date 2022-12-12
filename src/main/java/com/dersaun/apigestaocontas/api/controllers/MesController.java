package com.dersaun.apigestaocontas.api.controllers;


import com.dersaun.apigestaocontas.infra.repository.MesRepository;
import com.dersaun.apigestaocontas.infra.utils.MesUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("meses")
public class MesController {

    @Autowired
    private MesRepository mesRepository;

    @GetMapping("mesAtual")
    public ResponseEntity<?> buscarMesAtual() {
        var mesAtual = mesRepository.buscarMesAtual();
        return ResponseEntity.ok(
                MesUtils.getMesAno(mesAtual)
        );
    }
}
