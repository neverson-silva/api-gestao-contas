package com.dersaun.apigestaocontas.domain.services.impl;

import com.dersaun.apigestaocontas.api.request.DivisaoLancamentoDTO;
import com.dersaun.apigestaocontas.domain.Lancamento;
import com.dersaun.apigestaocontas.domain.Pessoa;
import com.dersaun.apigestaocontas.domain.dtos.DivisaoDTO;
import com.dersaun.apigestaocontas.domain.enums.EDivisaoTipo;
import com.dersaun.apigestaocontas.domain.services.LancamentoDivisaoService;
import com.dersaun.apigestaocontas.domain.services.LancamentoService;
import com.dersaun.apigestaocontas.infra.exception.HttpException;
import com.dersaun.apigestaocontas.infra.utils.NumberUtils;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class LancamentoDivisaoServiceImpl implements LancamentoDivisaoService {
    @Override
    public DivisaoDTO dividirIgualmente(Lancamento lancamento, DivisaoLancamentoDTO divisaoLancamentoDTO) {

        var divisao = new DivisaoDTO();
        divisao.setTipoDivisao(EDivisaoTipo.IGUALMENTE);

        divisao.setValorLancamentoOriginal(
                NumberUtils.roundValue(lancamento.getValor().doubleValue() / divisaoLancamentoDTO.getPessoas().size() + 1)
        );

        divisaoLancamentoDTO.getPessoas().each(pessoaDivisao -> {
            var lancamentoDividido = LancamentoService.criarRelacionado(lancamento, divisao.getValorLancamentoOriginal(), pessoaDivisao.getId());

            lancamentoDividido.setDivisaoId(
                    divisao.getTipoDivisao().getValor()
            );
            lancamentoDividido.setPessoa(new Pessoa(pessoaDivisao.getId()));
            divisao.getLancamentos().add(lancamentoDividido);
        });
        return divisao;
    }

    @Override
    public DivisaoDTO dividirDiferente(Lancamento lancamento, DivisaoLancamentoDTO divisaoLancamentoDTO) {
        var divisao = new DivisaoDTO();
        divisao.setTipoDivisao(EDivisaoTipo.DIFERENTE);

        AtomicReference<BigDecimal> valorOriginal = new AtomicReference<>(lancamento.getValor());


        divisaoLancamentoDTO.getPessoas().each(pessoaDivisao -> {
            var valor = valorOriginal.get();

            valor = valor.subtract(pessoaDivisao.getValor());

            if (valor.doubleValue() <= 0D) {
                throw HttpException.badRequest("O valor dividido do lançamento ultrapassou o valor total.");
            }

            var lancamentoDividido = LancamentoService.criarRelacionado(lancamento, pessoaDivisao.getValor(), pessoaDivisao.getId());

            lancamentoDividido.setDivisaoId(
                    divisao.getTipoDivisao().getValor()
            );
            lancamentoDividido.setPessoa(new Pessoa(pessoaDivisao.getId()));
            lancamentoDividido.setDivisaoId(
                    divisao.getTipoDivisao().getValor()
            );

            divisao.getLancamentos().add(lancamentoDividido);
            valorOriginal.set(
                    NumberUtils.roundValue(valor)
            );
        });
        divisao.setValorLancamentoOriginal(valorOriginal.get());
        return divisao;
    }
}
