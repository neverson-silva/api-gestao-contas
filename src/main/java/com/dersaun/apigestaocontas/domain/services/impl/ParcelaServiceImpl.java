package com.dersaun.apigestaocontas.domain.services.impl;

import com.dersaun.apigestaocontas.domain.Lancamento;
import com.dersaun.apigestaocontas.domain.Mes;
import com.dersaun.apigestaocontas.domain.Parcela;
import com.dersaun.apigestaocontas.domain.dtos.Parcelamento;
import com.dersaun.apigestaocontas.domain.services.ParcelaService;
import com.dersaun.apigestaocontas.infra.repository.ParcelaRepository;
import org.eclipse.collections.impl.list.mutable.FastList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

@Service
public class ParcelaServiceImpl implements ParcelaService {

    @Autowired
    private ParcelaRepository parcelaRepository;

    @Override
    public void parcelar(List<Parcelamento> parcelamentos) {
        parcelamentos.forEach(this::parcelar);
    }

    @Override
    public void parcelar(Parcelamento parcelamento) {
        var parcelas = new FastList<Parcela>();
        var quantidadeParcelas = parcelamento.getParcelasCriar();
        var start = parcelamento.getStart();

        IntStream.rangeClosed(start, quantidadeParcelas)
                .forEach(numero -> parcelas.add(create(numero, parcelamento, true)));

        parcelamento.getLancamento().setParcelas(parcelas);
    }

    @Override
    public boolean setParcelaAtual(Parcela parcela) {
        return false;
    }


    @Override
    public void atualizar(Lancamento lancamento, Boolean eraParcelado, Boolean atualmenteParcelado, int quantidadeParcelasOriginal, boolean reparcelar, Mes mesAtual) {

        if (atualmenteParcelado) {
            if (eraParcelado) {
                this.reparcelar(lancamento, quantidadeParcelasOriginal, mesAtual);

            } else {
                var parcelamentos = lancamento.getLancamentos().collect(lanc -> new Parcelamento(lanc, mesAtual));
                parcelamentos.add(
                        new Parcelamento(lancamento, mesAtual)
                );
                this.parcelar(parcelamentos);
            }
        } else {
            this.parcelaRepository.apagarTudoPorLancamento(lancamento);
            this.parcelaRepository.apagarTudoRelacionadoPorLancamentoId(lancamento.getId());
        }
    }

    @Override
    public void atualizar(Lancamento lancamento, Boolean eraParcelado, Boolean parcelado, int quantidadeParcelasOriginal, Mes mesAtual) {

        if (parcelado) {
            if (eraParcelado) {
                this.reparcelar(lancamento, quantidadeParcelasOriginal, mesAtual);
            } else {
                this.parcelar(new Parcelamento(lancamento, mesAtual));
            }
        } else if (eraParcelado) {
            this.parcelaRepository.apagarTudoPorLancamento(lancamento);
            this.parcelaRepository.apagarTudoRelacionadoPorLancamentoId(lancamento.getId());
        }
    }


    @Override
    public void reparcelar(Lancamento lancamento, Integer quantidadeParcelasOriginal, Mes mesAtual) {
        var parcelamentos = FastList.newListWith(new Parcelamento(lancamento, mesAtual));

        this.parcelaRepository.apagarTudoPorLancamento(lancamento);
        lancamento.getParcelas().clear();

        if (lancamento.isDividido()) {
            this.parcelaRepository.apagarTudoRelacionadoPorLancamentoId(lancamento.getId());
            parcelamentos.addAll(
                    lancamento.getLancamentos().collect(lanc -> {
                        lanc.getParcelas().clear();
                        return  new Parcelamento(lanc, mesAtual);
                    })
            );
        }
        this.parcelar(parcelamentos);
    }

    /**
     * Cria uma parcela a partir dos parametros
     *
     */
    private Parcela create(int numero, Parcelamento parcelamento, boolean shouldIncrement) {
        var atual = parcelamento.checkIsAtual(numero);
        var pago = parcelamento.checkIsPago(numero);
        int vencimento = Optional.ofNullable(parcelamento.getLancamento().getFormaPagamento().getDiaVencimento())
                .orElse(9);
        var parcela = new Parcela(
                vencimento,
                numero,
                parcelamento.getValorPorParcela(),
                pago ? parcelamento.getValorPorParcela() : BigDecimal.ZERO,
                parcelamento.getLancamento(),
                pago,
                atual);
        parcela.setMesReferencia(new Mes(parcelamento.getMesAno().getMesReferencia()));
        parcela.setAnoReferencia(parcelamento.getMesAno().getAnoReferencia());

        if (shouldIncrement) {
            parcelamento.setMesAno(
                    parcelamento.getMesAno().getMesReferencia(),
                    parcelamento.getMesAno().getAnoReferencia()
            );
        }
        return parcela;
    }
}
