package com.dersaun.apigestaocontas.domain.services;

import com.dersaun.apigestaocontas.api.request.LancamentoDTO;
import com.dersaun.apigestaocontas.domain.Lancamento;
import com.dersaun.apigestaocontas.domain.Pessoa;

import java.math.BigDecimal;

public interface LancamentoService {

    Lancamento salvar(LancamentoDTO cadastrarLancamentoDTO);
    Lancamento apagar(Long idLancamento);

    void atualizar(Long id, LancamentoDTO lancamentoDTO);

    static Lancamento criarRelacionado(Lancamento lancamento, BigDecimal valorPorPessoa, Long pessoaId) {
        var novoLancamento = new Lancamento();
        novoLancamento.setNome(lancamento.getNome());
        novoLancamento.setDescricao(lancamento.getDescricao());
        novoLancamento.setValor(lancamento.getValor());
        novoLancamento.setDataCompra(lancamento.getDataCompra());
        novoLancamento.setAno(lancamento.getAno());
        novoLancamento.setQuantidadeParcelas(lancamento.getQuantidadeParcelas());
        novoLancamento.setPessoa(new Pessoa(pessoaId));
        novoLancamento.setParcelado(lancamento.getParcelado());
        novoLancamento.setFormaPagamento(lancamento.getFormaPagamento());
        novoLancamento.setMes(lancamento.getMes());
        novoLancamento.setPago(lancamento.getPago());
        novoLancamento.setTipoConta(lancamento.getTipoConta());
        novoLancamento.setValorDividido(valorPorPessoa);
        novoLancamento.setLancamentoRelacionado(lancamento);

        return novoLancamento;
    }

}
