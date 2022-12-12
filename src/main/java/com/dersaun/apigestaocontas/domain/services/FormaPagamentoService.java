package com.dersaun.apigestaocontas.domain.services;

import com.dersaun.apigestaocontas.domain.FormaPagamento;
import org.eclipse.collections.api.list.MutableList;

public interface FormaPagamentoService {

    MutableList<FormaPagamento> buscarFormasPagamentosAtivasAdmin();

    MutableList<FormaPagamento> buscarFormasPagamentosDono(Long idPessoa);

    FormaPagamento buscarPorId(Long id);
}
