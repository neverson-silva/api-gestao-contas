package com.dersaun.apigestaocontas.api.request;

import com.dersaun.apigestaocontas.infra.utils.NumberUtils;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eclipse.collections.api.list.MutableList;
import org.eclipse.collections.impl.list.mutable.FastList;

import javax.validation.Valid;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LancamentoDTO implements Serializable {

    protected String descricao;

    @NotEmpty(message = "Nome da compra não informado")
    protected String nome;

    @DecimalMin(value = "0.0", inclusive = false, message = "Valor da compra é obrigatório e precisa ser maior que 0")
    protected BigDecimal valor;

    @Min(value = 1, message = "Mês referencia deve ser informado e ser maior que 1 e menor que 12")
    @Max(value = 12, message = "Mês referencia deve ser informado e ser maior que 1 e menor que 12")
    protected Long mesReferencia;

    @NotNull(message = "Forma de pagamento é obrigatória")
    protected Long formaPagamentoId;

    @NotNull(message = "Dono da compra é obrigatória")
    protected Long idPessoa;

    @Valid
    protected DivisaoLancamentoDTO divisao;

    protected Boolean parcelado;

    protected Integer quantidadeParcelas;

    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    protected LocalDate dataCompra;

    public Boolean isDividido() {
        return this.getDivisao() != null && this.getDivisao().getPessoas().notEmpty();
    }

    public Boolean isDivididoIgualmente() {
        return this.isDividido() && this.getDivisao().isIgualmente();
    }

    public Boolean isDivididoDiferente() {
        return this.isDividido() && this.getDivisao().isDiferente();
    }

    public MutableList<Long> obterPessoaIdsDivisao() {
        var ids = new FastList<>(this.divisao.pessoas).collect(PessoaDivisaoLancamentoDTO::getId);
        ids.add(this.getIdPessoa());
        return ids;
    }

    public BigDecimal obterValorTotalDivisao() {
        if (!this.isDividido()) {
            return BigDecimal.ZERO;
        }
        return NumberUtils.somar(this.getDivisao().getPessoas().collect(PessoaDivisaoLancamentoDTO::getValor));
    }

    public Boolean isValorDivididoMaiorLancamento() {
        var valorLancamento = this.valor;
        var valorDivisao = this.obterValorTotalDivisao();

        return valorDivisao.doubleValue() > valorLancamento.doubleValue();
    }
}
