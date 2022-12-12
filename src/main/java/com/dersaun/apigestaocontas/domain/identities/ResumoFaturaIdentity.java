package com.dersaun.apigestaocontas.domain.identities;

import com.dersaun.apigestaocontas.domain.dtos.MesAnoDTO;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Data
public class ResumoFaturaIdentity implements Serializable {
    @Column(name = "pessoa_id")
    private Long pessoaId;

    @Column(name = "cartao_id")
    private Long formaPagamentoId;

    @Column(name = "mes_id")
    private Long mesId;
    private Integer ano;

    public ResumoFaturaIdentity() {

    }

    public ResumoFaturaIdentity(Long devedorId, Long formaPagamentoId, Integer ano, Long mesId) {
        this.pessoaId = devedorId;
        this.formaPagamentoId = formaPagamentoId;
        this.ano = ano;
        this.mesId = mesId;
    }

    public ResumoFaturaIdentity(Long devedorId, Long formaPagamentoId, MesAnoDTO mesAnoDTO) {
        this.pessoaId = devedorId;
        this.formaPagamentoId = formaPagamentoId;
        this.ano = mesAnoDTO.getAnoReferencia();
        this.mesId = mesAnoDTO.getMesReferencia();
    }

}