package com.dersaun.apigestaocontas.api.controllers;

import com.dersaun.apigestaocontas.api.request.LancamentoDTO;
import com.dersaun.apigestaocontas.domain.services.LancamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("lancamentos")
public class LancamentoController {

    @Autowired
    private LancamentoService lancamentoService;

    @PostMapping(value = "",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<?> cadastrarLancamento(@Valid @RequestBody LancamentoDTO params) {
        var lancamento = lancamentoService.salvar(params);
        return ResponseEntity.ok(lancamento);
    }

    @PutMapping(value = "{idLancamento}",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Void> atualizarLancamento(@PathVariable("idLancamento") Long idLancamento,
                                                    @Valid @RequestBody LancamentoDTO params) {
        lancamentoService.atualizar(idLancamento, params);
        return ResponseEntity.noContent().build();
    }
}
