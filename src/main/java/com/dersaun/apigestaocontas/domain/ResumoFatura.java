package com.dersaun.apigestaocontas.domain;

import com.dersaun.apigestaocontas.domain.dtos.MesAnoDTO;
import com.dersaun.apigestaocontas.domain.identities.ResumoFaturaIdentity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler" })
@Entity
@Table(name = "resumo_fatura")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResumoFatura {

    @EmbeddedId
    private ResumoFaturaIdentity id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn( name = "pessoa_id", insertable = false, updatable = false)
    private Pessoa pessoa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = true, name = "cartao_id", insertable = false, updatable = false)
    private FormaPagamento formaPagamento;

    private BigDecimal valorTotal;
    private BigDecimal valorParcelado;

    @Column(name = "valor_a_vista")
    private BigDecimal valorAVista;

    private BigDecimal saldo;

    public Boolean isParcelado() {
        return this.valorParcelado != null && this.valorParcelado.doubleValue() > 0.0;
    }

    public Boolean isCartaoAvista() {
        return formaPagamento.isCartao() && this.valorAVista != null && this.valorAVista.doubleValue() > 0.0;
    }

    public Boolean isInPeriod(MesAnoDTO mesAnoDTO) {
        if (mesAnoDTO == null) {
            return false;
        }
        return this.getId().getMesId().equals(mesAnoDTO.getMesReferencia()) && Objects.equals(this.getId().getAno(), mesAnoDTO.getAnoReferencia());
    }

}
