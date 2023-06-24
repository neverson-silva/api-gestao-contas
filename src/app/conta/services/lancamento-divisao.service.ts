import { ILancamentoDivisaoService } from '@app/conta/interfaces/lancamento-divisao.service.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Lancamento } from '@app/conta/models/lancamento.entity';
import { DivisaoLancamentoDTO } from '@app/conta/dtos/lancamento.dto';
import { DivisaoDTO, EDivisaoTipo } from '@app/conta/dtos/divisao.dto';
import { numberUtils } from '@utils/number';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';

@Injectable()
export class LancamentoDivisaoService implements ILancamentoDivisaoService {
  dividirDiferente(
    lancamento: Lancamento,
    divisaoLancamentoDTO: DivisaoLancamentoDTO,
  ): DivisaoDTO {
    const divisao = new DivisaoDTO();
    divisao.tipoDivisao = EDivisaoTipo.DIFERENTE;

    let valorOriginal = lancamento.valor;

    divisaoLancamentoDTO.pessoas.forEach((pessoaDivisao) => {
      let valor = valorOriginal;

      valor -= pessoaDivisao.valor;

      if (valor <= 0) {
        throw new BadRequestException(
          'O valor dividido do lançamento ultrapassou o valor total.',
        );
      }

      const lancamentoDividido = this.criarRelacionado(
        lancamento,
        pessoaDivisao.valor,
        pessoaDivisao.id,
      );

      lancamentoDividido.divisaoId = divisao.tipoDivisao;
      lancamentoDividido.pessoa = new Pessoa(pessoaDivisao.id);
      lancamentoDividido.divisaoId = divisao.tipoDivisao;

      divisao.lancamentos.push(lancamentoDividido);
      valorOriginal = numberUtils.round(valor);
    });
    divisao.valorLancamentoOriginal = valorOriginal;

    return divisao;
  }

  dividirIgualmente(
    lancamento: Lancamento,
    divisaoLancamentoDTO: DivisaoLancamentoDTO,
  ): DivisaoDTO {
    const divisao = new DivisaoDTO();
    divisao.tipoDivisao = EDivisaoTipo.IGUALMENTE;

    divisao.valorLancamentoOriginal = numberUtils.round(
      lancamento.valor / (divisaoLancamentoDTO.pessoas.length + 1),
    );

    divisaoLancamentoDTO.pessoas.forEach((pessoaDivisao) => {
      const lancamentoDividido = this.criarRelacionado(
        lancamento,
        divisao.valorLancamentoOriginal,
        pessoaDivisao.id,
      );

      lancamentoDividido.divisaoId = divisao.tipoDivisao;
      lancamentoDividido.pessoa = { id: pessoaDivisao.id } as Pessoa;
      divisao.lancamentos.push(lancamentoDividido);
    });
    return divisao;
  }

  private criarRelacionado(
    lancamento: Lancamento,
    valorPorPessoa: number,
    pessoaId: number,
  ): Lancamento {
    const novoLancamento: Lancamento = {
      nome: lancamento.nome,
      descricao: lancamento.descricao,
      valor: lancamento.valor,
      dataCompra: lancamento.dataCompra,
      ano: lancamento.ano,
      quantidadeParcelas: lancamento.quantidadeParcelas,
      pessoa: { id: pessoaId } as Pessoa,
      parcelado: lancamento.parcelado,
      formaPagamento: lancamento.formaPagamento,
      mes: lancamento.mes,
      pago: lancamento.pago,
      tipoConta: lancamento.tipoConta,
      valorDividido: valorPorPessoa,
      lancamentoRelacionado: lancamento,
    } as Lancamento;
    return novoLancamento;
  }
}
