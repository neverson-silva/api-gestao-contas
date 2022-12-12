package com.dersaun.apigestaocontas.api.controllers;


import com.dersaun.apigestaocontas.domain.FormaPagamento;
import com.dersaun.apigestaocontas.domain.services.FormaPagamentoService;
import com.dersaun.apigestaocontas.domain.services.UsuarioService;
import org.eclipse.collections.api.list.MutableList;
import org.eclipse.collections.impl.list.mutable.FastList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("formas-pagamentos")
public class FormaPagamentoController {

    @Autowired
    private FormaPagamentoService formaPagamentoService;

    @GetMapping()
    public ResponseEntity<MutableList<FormaPagamento>> getFormasPagamentos() {

        MutableList<FormaPagamento> formaPagamentos = new FastList<>();
        var usuario = UsuarioService.usuario();
        if (usuario.isAdmin()) {
            formaPagamentos = formaPagamentoService.buscarFormasPagamentosAtivasAdmin();
        } else {
            formaPagamentos = formaPagamentoService.buscarFormasPagamentosDono(
                    usuario.getPessoa().getId()
            );
        }
        return ResponseEntity.ok(formaPagamentos);
    }
}
