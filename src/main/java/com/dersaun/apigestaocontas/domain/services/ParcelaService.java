package com.dersaun.apigestaocontas.domain.services;

import com.dersaun.apigestaocontas.domain.Lancamento;
import com.dersaun.apigestaocontas.domain.Mes;
import com.dersaun.apigestaocontas.domain.Parcela;
import com.dersaun.apigestaocontas.domain.dtos.Parcelamento;

import java.util.List;
import java.util.Optional;

public interface ParcelaService {

    void parcelar(List<Parcelamento> parcelamentos);
    void parcelar(Parcelamento parcelamento);

    void reparcelar(Lancamento lancamento, Integer quantidadeParcelasOriginal, Mes mesAtual);
    boolean setParcelaAtual(Parcela parcela);

    void atualizar(Lancamento lancamento, Boolean eraParcelado, Boolean atualmenteParcelado, int quantidadeParcelasOriginal, boolean reparcelar, Mes mesAtual);

    void atualizar(Lancamento lancamento, Boolean eraParcelado, Boolean parcelado, int quantidadeParcelasOriginal, Mes mesAtual);


    static Parcela createMockParcela(Lancamento lancamento, Parcela parcela) {
        var parcel = new Parcela();

        parcel.setId(lancamento.getId() * parcela.getId());
        parcel.setVencimento(
                Optional.ofNullable(lancamento.getFormaPagamento().getDiaVencimento())
                        .orElse(parcela.getVencimento())
        );
        parcel.setNumero(parcela.getNumero());
        parcel.setValor(lancamento.getValorPorParcela());

        if (parcela.isPago()) {
            parcel.setValorPago(parcel.getValor());
        }
        parcel.setLancamento(lancamento);
        parcel.setPago(parcela.isPago());
        parcel.setAtual(parcela.isAtual());
        parcel.setMesReferencia(parcela.getMesReferencia());
        parcel.setAnoReferencia(parcela.getAnoReferencia());
        parcel.setCreatedAt(parcela.getCreatedAt());
        parcel.setUpdatedAt(parcela.getUpdatedAt());

        return parcel;
    }
}
