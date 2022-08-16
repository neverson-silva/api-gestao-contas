package com.dersaun.apigestaocontas.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDateTime;

@JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler" })
@Entity
@Table(name = "meses")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Mes {

    @Id
    @GeneratedValue
    @Column(name = "mes_id")
    private Long id;

    @Column(nullable = false, length = 15)
    private String nome;

    private Boolean atual;

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
        return atual;
    }

    public Mes(Long id) {
        this.id = id;
    }

    public Mes(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }
}
