package com.dersaun.apigestaocontas.domain;

import com.dersaun.apigestaocontas.domain.interfaces.Divisivel;
import com.dersaun.apigestaocontas.infra.utils.NumberUtils;
import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.*;
import org.eclipse.collections.api.list.MutableList;
import org.eclipse.collections.impl.list.mutable.FastList;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static com.dersaun.apigestaocontas.domain.services.ResumoFaturaService.CARNE;
import static com.dersaun.apigestaocontas.domain.services.ResumoFaturaService.DINHEIRO;

@Entity
@Table(name = "contas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"lancamentoRelacionado", "lancamentos", "parcelas"})
@JsonIgnoreProperties(value = {"lancamentos", "principal", "hibernateLazyInitializer", "handler"})
@EqualsAndHashCode(exclude = {"lancamentoRelacionado", "lancamentos", "parcelas"})
public class Lancamento implements Divisivel, Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "conta_id")
    private Long id;

    @Column(name = "compra_nome", nullable = false, length = 50)
    private String nome;

    @Column(length = 150)
    private String descricao;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal valor;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    @Column(nullable = false)
    private LocalDate dataCompra;

    @Column(length = 5, nullable = false)
    private Integer ano;

    private Boolean parcelado;

    @Column(name = "qtd_parcelas")
    private Integer quantidadeParcelas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "devedor_id")
    @JsonIgnore
    private Pessoa pessoa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cartao_id")
    @JsonIgnore
    private FormaPagamento formaPagamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mes_id")
    private Mes mes;

    private Boolean pago;

    @Column(length = 1)
    private Integer tipoConta;

    @Column(name = "divisao_id")
    private Integer divisaoId;

    @ManyToOne(optional = true, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "conta_id_relacionado")
    @JsonBackReference
    private Lancamento lancamentoRelacionado;

    @OneToMany(fetch = FetchType.LAZY,
            targetEntity = Lancamento.class, mappedBy = "lancamentoRelacionado", cascade = CascadeType.ALL
    )
    @JsonManagedReference
    private List<Lancamento> lancamentos = new FastList<>();


    @OneToMany(fetch = FetchType.LAZY,
            targetEntity = Parcela.class, mappedBy = "lancamento", cascade = CascadeType.ALL
    )
    @JsonIgnore
    private List<Parcela> parcelas = new FastList<>();

    @CreationTimestamp
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    @Column(precision = 8, scale = 2)
    private BigDecimal valorDividido;

    @Override
    public Boolean isPrincipal() {
        return divisaoId != null && lancamentoRelacionado == null;
    }

    @Override
    public Boolean isDividido() {
        return( divisaoId != null || !this.getLancamentos().isEmpty());
    }

    public Boolean isPago() {
        return pago != null && pago;
    }

    public Boolean isParcelado() {
        return parcelado != null && parcelado;
    }

    public Boolean isReadOnly() {
        return isDividido() && !isPrincipal() || getFormaPagamento().getDono() != null
                && !getFormaPagamento().getDono().getId().equals(getPessoa().getId()) && !Arrays.asList(DINHEIRO, CARNE).contains(getFormaPagamento().getId());

    }

    @Override
    public Divisivel getPrincipal() {

        try {
            if (divisaoId != null && lancamentoRelacionado != null) {
                return lancamentoRelacionado;
            }
        } catch (Exception e) {

        }

        return this;
    }

    @Override
    public BigDecimal getValorUtilizado() {
        if (isDividido()) {
            return valorDividido;
        } else {
            return valor;
        }
    }

    public BigDecimal getValorPorParcela() {
        Double valor = 0D;
        if (isParcelado()) {
            valor = getValorUtilizado().doubleValue() / quantidadeParcelas;
        }
        return NumberUtils.roundValue(valor);
    }

    @Override
    public Boolean hasLancamentosDivididos() {
        return !getLancamentos().isEmpty();
    }

    public void setValor(BigDecimal valor) {
        if (valor != null) {
            this.valor = NumberUtils.roundValue(valor);
        } else {
            this.valor = null;
        }
    }

    public void setValorDividido(BigDecimal valor) {
        if (valor != null) {
            this.valorDividido = NumberUtils.roundValue(valor);
        } else {
            this.valorDividido = null;
        }
    }

    public void addRelacionado(Lancamento lancamento) {
        if (lancamentos == null) {
            lancamentos = new FastList<>();
        }
        lancamentos.add(lancamento);
    }

    public void addAllRelacionado(List<Lancamento> lancamentos) {
        if (lancamentos == null) {
            lancamentos = new FastList<>();
        }
        lancamentos.addAll(lancamentos);
    }

    public MutableList<Lancamento> getLancamentos() {
        try {
            if (!(lancamentos instanceof MutableList)) {
                lancamentos = new FastList<>(lancamentos);
            }
            return (MutableList<Lancamento>) lancamentos;
        } catch (Exception e) {
            return new FastList<>();
        }
    }

}