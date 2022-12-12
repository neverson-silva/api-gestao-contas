package com.dersaun.apigestaocontas.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDateTime;

@JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler" })
@Entity
@Table(name = "cartoes")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode()
public class FormaPagamento {

    @Id
    @GeneratedValue
    @Column(name = "cartao_id")
    private Long id;

    private String nome;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
    @JoinColumn(name = "devedor_id")
    private Pessoa dono;

    private Boolean ativo;

    @Column(name = "vencimento")
    private Integer diaVencimento;

    private String cor;

    @CreationTimestamp
    @Column(name = "created_at")
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dataAlteracao;

    public Boolean isCartao() {
        return this.getId() != 6L && this.getId() != 7L;
    }

    public Boolean isDinheiro() {
        return this.getId() == 7L;
    }

    public FormaPagamento(Long id) {
        this.id = id;
    }
}
