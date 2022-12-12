package com.dersaun.apigestaocontas.api.controllers;

import com.dersaun.apigestaocontas.domain.Pessoa;
import com.dersaun.apigestaocontas.domain.services.PessoaService;
import org.eclipse.collections.api.list.MutableList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("pessoas")
public class PessoaController {

    @Autowired
    private PessoaService pessoaService;

    @GetMapping()
    public ResponseEntity<MutableList<Pessoa>> getPessoas() {
        var pessoas = pessoaService.getPessoas();
        return ResponseEntity.ok(pessoas);

    }
}
