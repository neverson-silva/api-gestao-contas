package com.dersaun.apigestaocontas.domain;

import com.dersaun.apigestaocontas.infra.utils.NumberUtils;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "parcelas")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"conta", "lancamento"})
public class Parcela {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parcela_id")
    private Long id;

    @Column(length = 3)
    private Integer vencimento;

    @Column(name = "nr_parcela", nullable = false, length = 10)
    private Integer numero;

    @Column(name = "valor_parcela", precision = 8, scale = 2)
    private BigDecimal valor;

    @Column(name = "valor_pago", precision = 8, scale = 2)
    private BigDecimal valorPago;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_id")
    @JsonIgnore
    private Lancamento lancamento;

    @Column(nullable = true, columnDefinition = "default 0")
    private Boolean pago;

    @Column(name = "parcela_atual")
    private Boolean atual;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mes_id")
    private Mes mesReferencia;

    @Column(name = "ano")
    private Integer anoReferencia;

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

    public Boolean isAtual() {
        return atual != null && atual;
    }

    public Boolean isPago() {
        return pago != null && pago;
    }

    public Parcela(Integer vencimento,
                   Integer numero,
                   BigDecimal valor,
                   BigDecimal valorPago,
                   Lancamento lancamento,
                   Boolean pago,
                   Boolean atual) {
        this.vencimento = vencimento;
        this.numero = numero;
        setValor(valor);
        setValorPago(valorPago);
        this.lancamento = lancamento;
        this.pago = pago;
        this.atual = atual;
    }

    public BigDecimal getValorUtilizado() {

        try {
            if (isPago()) {
                return valorPago;
            }
            return valor;
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return BigDecimal.ZERO;

    }

    public void setValor(BigDecimal valor) {
        this.valor = NumberUtils.roundValue(valor);
    }

    public void setValorPago( BigDecimal valor) {

        if (valor == null || valor.doubleValue() == 0D && pago != null && pago) {
            this.valorPago = NumberUtils.roundValue(this.valor);
        } else if (pago !=  null && !pago){
            this.valorPago = BigDecimal.valueOf(0D);
        } else {
            this.valorPago = NumberUtils.roundValue(valor);
        }
    }

    public String getContaNome() {
        return lancamento.getNome();
    }
}