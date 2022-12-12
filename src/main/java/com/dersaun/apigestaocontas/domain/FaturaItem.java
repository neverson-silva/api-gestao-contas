package com.dersaun.apigestaocontas.domain;


import com.dersaun.apigestaocontas.domain.interfaces.Divisivel;
import com.dersaun.apigestaocontas.domain.interfaces.Faturavel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.eclipse.collections.api.list.MutableList;
import org.eclipse.collections.impl.list.mutable.FastList;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "fatura")
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FaturaItem implements Divisivel, Faturavel {

    @Id
    private Long id;

    @Column(nullable = false, insertable = false, updatable = false)
    private Long fechamento;

    @Column(insertable = false, updatable = false)
    private Integer ano;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcela_id", insertable = false, updatable = false)
    private Parcela parcela;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_id", insertable = false, updatable = false)
    private Lancamento lancamento;

    @Column(name = "devedor_id", insertable = false, updatable = false)
    private Long pessoaId;

    @Transient
    @JsonInclude
    private MutableList<FaturaItem> itensRelacionados = new FastList<>();

    public Integer getAno() {
        return ano;
    }

    public Long getFechamento() {
        return fechamento;
    }

    public Pessoa getPessoa() {
        return lancamento.getPessoa();
    }

    public FormaPagamento getFormaPagamento() {
        return lancamento.getFormaPagamento();
    }

    public Integer getDivisaoId() {
        return lancamento.getDivisaoId();
    }

    public Boolean isParcelado() {
        return lancamento.isParcelado();
    }

    @Override
    public Boolean isPrincipal() {
        return lancamento.isPrincipal();
    }

    @Override
    public Boolean isDividido() {
        return lancamento.isDividido();
    }

    @Override
    public Boolean hasLancamentosDivididos() {
        return lancamento.hasLancamentosDivididos();
    }

    public boolean isReadOnly() {
        return lancamento.isReadOnly();

    }

    @Override
    @JsonIgnore
    public Divisivel getPrincipal() {

        return lancamento.getPrincipal();
    }

    @Override
    public BigDecimal getValorUtilizado() {

        if (isParcelado()) {
            return parcela.getValorUtilizado();
        }
        return lancamento.getValorUtilizado();
    }

    public String getNome() {
        return lancamento.getNome();
    }

    @JsonIgnore
    public Lancamento getLancamentoRelacionado() {
        return lancamento.getLancamentoRelacionado();
    }

    public void addFaturaItemRelacionado(FaturaItem faturaItem) {
        itensRelacionados.add(faturaItem);
    }

    public void addAllFaturaItemRelacionado(List<FaturaItem> itemsRelacionados) {
        if (itemsRelacionados == null) {
            itensRelacionados = new FastList<>();
        }
        itensRelacionados.addAll(itemsRelacionados);
    }

}