package com.dersaun.apigestaocontas.domain.services.impl;

import com.dersaun.apigestaocontas.domain.FormaPagamento;
import com.dersaun.apigestaocontas.domain.services.FormaPagamentoService;
import com.dersaun.apigestaocontas.infra.exception.HttpException;
import com.dersaun.apigestaocontas.infra.repository.FormaPagamentoRepository;
import org.eclipse.collections.api.list.MutableList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FormaPagementoServiceImpl implements FormaPagamentoService {

    @Autowired
    private FormaPagamentoRepository formaPagamentoRepository;

    @Override
    public MutableList<FormaPagamento> buscarFormasPagamentosAtivasAdmin() {
        return formaPagamentoRepository.findAllByOrderByNomeAsc();
    }

    @Override
    public MutableList<FormaPagamento> buscarFormasPagamentosDono(Long idPessoa) {
        return formaPagamentoRepository.findAllByDonoIdOrderByNomeAsc(idPessoa);
    }

    @Override
    public FormaPagamento buscarPorId(Long id) {
        return formaPagamentoRepository.findById(id).orElseThrow(() -> HttpException.notFound("Forma de pagamento não cadastrada") );
    }
}
