package com.dersaun.apigestaocontas.api.controllers;

import com.dersaun.apigestaocontas.api.request.BuscarLancamentosFaturaRequestDTO;
import com.dersaun.apigestaocontas.domain.FaturaItem;
import com.dersaun.apigestaocontas.domain.dtos.PaginationDTO;
import com.dersaun.apigestaocontas.domain.services.FaturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("faturas")
public class FaturaController {

    @Autowired
    private FaturaService faturaService;

    @GetMapping("fatura-atual")
    public ResponseEntity<Page<FaturaItem>> buscarItensFaturaAtual(@Valid PaginationDTO paginationDTO) {
        var itens = faturaService.buscarItensFaturaAtual(paginationDTO);
        return ResponseEntity.ok(itens);
    }

    @GetMapping("buscar-itens-fatura")
    public ResponseEntity<Page<FaturaItem>> buscarItensFatura(@Valid BuscarLancamentosFaturaRequestDTO paginationDTO) {
        var itens = faturaService.buscarItensFatura(paginationDTO);
        return ResponseEntity.ok(itens);
    }
}
