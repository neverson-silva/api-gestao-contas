package com.dersaun.apigestaocontas.domain.dtos;

import com.dersaun.apigestaocontas.domain.Lancamento;
import com.dersaun.apigestaocontas.domain.Mes;
import com.dersaun.apigestaocontas.infra.utils.MesUtils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

import static com.dersaun.apigestaocontas.infra.utils.NumberUtils.roundValue;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Parcelamento implements Serializable {
    private Lancamento lancamento;

    private Mes mesAtual;

    private MesAnoDTO mesAno;

    private Integer numeroInicial;

    private Boolean atual;

    private Integer quantidade;

    private LocalDate hoje = LocalDate.now();

    public Parcelamento(Lancamento lancamento, Mes mes) {
        this.lancamento = lancamento;
        this.mesAtual = mes;
        this.numeroInicial = 1;
        this.atual = true;
        this.quantidade = lancamento.getQuantidadeParcelas();
        this.mesAno = MesUtils.getMesAnoReferencia(lancamento.getMes().getId(), lancamento.getAno(), true);
    }

    public Parcelamento(Lancamento lancamento, Mes mes, Integer numeroInicial, Boolean isAtual, Integer quantidade) {
        this.lancamento = lancamento;
        this.mesAtual = mes;
        this.numeroInicial = numeroInicial;
        this.atual = isAtual;
        this.quantidade = quantidade;
        this.mesAno = MesUtils.getMesAnoReferencia(lancamento.getMes().getId(), lancamento.getAno(), true);

    }

    public Parcelamento(Lancamento lancamento, Mes mes, Integer numeroInicial, Boolean isAtual,
                        Integer quantidade, Long mesId, Integer ano) {
        this.lancamento = lancamento;
        this.mesAtual = mes;
        this.numeroInicial = numeroInicial;
        this.atual = isAtual;
        this.quantidade = quantidade;
        this.mesAno = MesUtils.getMesAnoReferencia(mesId, ano, true);

    }

    public Integer getStart() {

        if (numeroInicial == 1 && isAtual()) {
            return 1;
        }
        return numeroInicial + 1;
    }

    public Integer getParcelasCriar() {

        if (numeroInicial == 1 && isAtual()) {
            return quantidade;
        }
        return quantidade - numeroInicial;
    }

    public BigDecimal getValorPorParcela() {
        return roundValue(lancamento.getValorUtilizado().doubleValue() / quantidade);
    }

    public MesAnoDTO getMesAno() {
        if (mesAno == null) {
            return MesUtils.getMesAnoReferencia(mesAtual, true);
        }
        return mesAno;
    }

    public void setMesAno(MesAnoDTO mesAno) {
        this.mesAno = mesAno;
    }

    public void setMesAno(Long mesId, Integer ano) {
        this.mesAno = MesUtils.getMesAnoReferencia(mesId, ano, true);
    }

    public boolean checkIsAtual(Integer numero) {
        var atual = false;
        var ano = mesAno.getAnoReferencia();
        var mesId = mesAno.getMesReferencia();

        if (ano == hoje.getYear() && mesId - 1 == mesAtual.getId() ){
            atual = true;
        } else if (mesId == 1 && ano == this.hoje.getYear() && this.mesAtual.getId() == 12 && this.atual ) {
            atual = true;
        } else if (ano == hoje.getYear() && mesId - 1 < mesAtual.getId() ){
            atual = false;
        } else {
            atual = numero != null ? getStart() == numero : getStart() == 1;
        }
        return atual;
    }

    public boolean checkIsPago(Integer numero) {
        var pago = false;
        var ano = mesAno.getAnoReferencia();
        var mesId = mesAno.getMesReferencia().intValue();

        if (mesId == 1 && ano == this.hoje.getYear() && this.mesAtual.getId().intValue() == 12 && this.atual) {
            pago = false;
        } else if (ano == this.hoje.getYear() && mesId - 1 == this.mesAtual.getId().intValue() ){
            pago = false;
        } else if (this.mesAtual.getId().intValue() == 12 && ano == this.hoje.getYear() && mesId > this.hoje.getMonthValue()){
            pago = false;
        } else if (ano == this.hoje.getYear() && mesId - 1 < this.mesAtual.getId().intValue()){
            pago = true;
        } else {
            pago = this.numeroInicial > this.getStart();
        }
        return pago;
    }

    public Boolean isAtual() {
        return atual;
    }

}