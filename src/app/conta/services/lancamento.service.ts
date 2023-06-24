import { ILancamentoRepository } from '@app/conta/interfaces/lancamento.repository.interface';
import { ILancamentoService } from '@app/conta/interfaces/lancamento.service.interface';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DivisaoLancamentoDTO,
  LancamentoDTO,
} from '@app/conta/dtos/lancamento.dto';
import { Lancamento } from '@app/conta/models/lancamento.entity';
import { orElse } from '@utils/index';
import * as moment from 'moment';
import { FormaPagamento } from '@app/conta/models/forma-pagamento.entity';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { Mes } from '@app/conta/models/mes.entity';
import { strings } from '@utils/strings';
import { IMesService } from '@app/conta/interfaces/mes.service.interface';
import { DivisaoDTO } from '@app/conta/dtos/divisao.dto';
import { ILancamentoDivisaoService } from '@app/conta/interfaces/lancamento-divisao.service.interface';
import { Parcelamento } from '@app/conta/dtos/parcelamento';
import { IParcelaService } from '@app/conta/interfaces/parcela.service.interface';
import { UsuarioAutenticadoDto } from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { numberUtils } from '@utils/number';
import { EntityManager } from 'typeorm';

@Injectable()
export class LancamentoService implements ILancamentoService {
  constructor(
    @Inject('ILancamentoRepository')
    private readonly lancamentoRepository: ILancamentoRepository,
    @Inject('IMesService')
    private readonly mesService: IMesService,
    @Inject('ILancamentoDivisaoService')
    private readonly lancamentoDivisaoService: ILancamentoDivisaoService,
    @Inject('IParcelaService')
    private readonly parcelaService: IParcelaService,
  ) {}

  async apagar(idLancamento: number): Promise<void> {
    await this.lancamentoRepository.delete({ id: idLancamento });
  }

  async atualizar(
    idLancamento: number,
    lancamentoDTO: LancamentoDTO,
    usuario: UsuarioAutenticadoDto,
  ): Promise<void> {
    const lancamento = await this.lancamentoRepository.buscarCompleto(
      idLancamento,
    );
    if (!lancamento) {
      throw new NotFoundException(
        'Lançamento não encontrado, tente novamente mais tarde',
      );
    }

    if (lancamento.isReadOnly && !usuario.isAdmin()) {
      throw new BadRequestException(
        'Conta indisponível para atualização, verifique com a pessoa que realizou o cadastro',
      );
    }

    const mesAtual = await this.mesService.buscarMesAtual();
    await this.lancamentoRepository
      .getEntityManager()
      .transaction(async (transaction) => {
        await this.setTransactionsManager(transaction);

        if (lancamentoDTO.divisao?.igualmente) {
          await this.atualizarIgualmente(
            lancamento,
            lancamentoDTO,
            lancamentoDTO.parcelado,
            mesAtual,
          );
        } else if (lancamentoDTO.divisao?.diferente) {
          await this.atualizarDiferente(
            lancamento,
            lancamentoDTO,
            lancamentoDTO.parcelado,
            mesAtual,
          );
        } else {
          await this.atualizarContaNormal(
            lancamento,
            lancamentoDTO,
            lancamentoDTO.parcelado,
            mesAtual,
          );
        }
        await this.restoreTransactionsManagers();
      })
      .catch((err) => {
        this.restoreTransactionsManagers();
        throw err;
      });
  }

  async salvar(cadastrarLancamentoDTO: LancamentoDTO): Promise<Lancamento> {
    return await this.lancamentoRepository.manager
      .transaction(async (entityManager: EntityManager) => {
        this.setTransactionsManager(entityManager);

        const lancamento: Lancamento = await this.prepararLancamentoFromDTO(
          cadastrarLancamentoDTO,
        );

        if (
          cadastrarLancamentoDTO.divisao?.diferente ||
          cadastrarLancamentoDTO?.divisao?.igualmente
        ) {
          const resultadoDivisao = this.dividirLancamento(
            lancamento,
            cadastrarLancamentoDTO.divisao,
          );
          lancamento.lancamentos = resultadoDivisao.lancamentos;
          lancamento.valorDividido = resultadoDivisao.valorLancamentoOriginal;
          lancamento.divisaoId = resultadoDivisao.tipoDivisao;
        }

        if (lancamento.parcelado) {
          const parcelamentos =
            lancamento?.lancamentos?.map(
              (lanc) => new Parcelamento(lanc, lanc.mes),
            ) ?? [];
          parcelamentos.push(new Parcelamento(lancamento, lancamento.mes));
          await this.parcelaService.parcelar(parcelamentos);
        }

        await this.lancamentoRepository.save(lancamento);

        this.restoreTransactionsManagers();

        return lancamento;
      })
      .catch((err) => {
        this.restoreTransactionsManagers();
        throw err;
      });
  }

  private async prepararLancamentoFromDTO(
    cadastrarLancamentoDTO: LancamentoDTO,
  ): Promise<Lancamento> {
    const lancamento = new Lancamento();

    lancamento.nome = strings.beautify(cadastrarLancamentoDTO.nome);
    lancamento.descricao = cadastrarLancamentoDTO.descricao;
    lancamento.valor = cadastrarLancamentoDTO.valor;
    lancamento.dataCompra = cadastrarLancamentoDTO.dataCompra;
    lancamento.ano = cadastrarLancamentoDTO.dataCompra.getFullYear();
    lancamento.parcelado = cadastrarLancamentoDTO.parcelado;
    lancamento.quantidadeParcelas = cadastrarLancamentoDTO.quantidadeParcelas;
    lancamento.formaPagamento = {
      id: cadastrarLancamentoDTO.formaPagamentoId,
    } as FormaPagamento;

    if (cadastrarLancamentoDTO.mesReferencia != null) {
      lancamento.mes = new Mes(cadastrarLancamentoDTO.mesReferencia);
    } else {
      lancamento.mes = await this.mesService.getFromDataCompraAndFormaPagamento(
        cadastrarLancamentoDTO.dataCompra,
        lancamento.formaPagamento,
      );
    }

    lancamento.pessoa = new Pessoa(cadastrarLancamentoDTO.idPessoa);
    lancamento.pago = false;

    lancamento.tipoConta =
      cadastrarLancamentoDTO.formaPagamentoId == null ||
      cadastrarLancamentoDTO.formaPagamentoId == 0 ||
      cadastrarLancamentoDTO.formaPagamentoId == 7
        ? 2
        : 1;

    return lancamento;
  }

  private dividirLancamento(
    lancamento: Lancamento,
    divisao: DivisaoLancamentoDTO,
  ): DivisaoDTO {
    if (divisao.igualmente) {
      return this.lancamentoDivisaoService.dividirIgualmente(
        lancamento,
        divisao,
      );
    } else {
      return this.lancamentoDivisaoService.dividirDiferente(
        lancamento,
        divisao,
      );
    }
  }

  private async newValuesToConta(
    lancamento: Lancamento,
    lancamentoDTO: LancamentoDTO,
  ) {
    const {
      nome,
      descricao,
      valor,
      parcelado,
      quantidadeParcelas,
      idPessoa,
      formaPagamentoId,
      dataCompra,
      divisao,
    } = lancamentoDTO;

    const isDivididoDiferente = divisao?.diferente;
    const isDivididoIgualmente = divisao?.igualmente;

    lancamento.nome = orElse(nome, lancamento.nome);
    lancamento.descricao = orElse(descricao, lancamento.descricao);
    lancamento.valor = orElse(valor, lancamento.valor);
    lancamento.parcelado = orElse(parcelado, lancamento.parcelado);
    lancamento.quantidadeParcelas = orElse(
      quantidadeParcelas,
      lancamento.quantidadeParcelas,
    );

    if (lancamento.pessoa.id !== idPessoa) {
      lancamento.pessoa = new Pessoa(idPessoa);
    }

    if (lancamento.formaPagamento.id !== formaPagamentoId) {
      lancamento.formaPagamento = { id: formaPagamentoId } as FormaPagamento;
    }
    if (!moment(lancamento.dataCompra).isSame(moment(dataCompra))) {
      lancamento.dataCompra = dataCompra;
      lancamento.mes = await this.mesService.getFromDataCompraAndFormaPagamento(
        lancamento.dataCompra,
        lancamento.formaPagamento,
      );
    }
    lancamento.tipoConta =
      lancamento.formaPagamento == null || lancamento.formaPagamento.id == 7
        ? 2
        : 1;

    if (isDivididoDiferente) {
      lancamento.divisaoId = 2;
    } else if (isDivididoIgualmente) {
      lancamento.divisaoId = 1;
    } else {
      lancamento.divisaoId = null;
    }
    lancamento.valorDividido = null;
  }

  private async atualizarIgualmente(
    lancamento: Lancamento,
    lancamentoDto: LancamentoDTO,
    parcelado: boolean,
    mesAtual: Mes,
  ): Promise<void> {
    const mudouDivisao = this.isOutraDivisao(lancamento, lancamentoDto);

    const eraParcelado = lancamento.parcelado;
    const quantidadeParcelasOriginal = eraParcelado
      ? lancamento.quantidadeParcelas
      : 0;

    await this.newValuesToConta(lancamento, lancamentoDto);

    const redividir =
      this.osDevedoresMudaram(lancamento, lancamentoDto) ||
      lancamento.lancamentos.length === 0 ||
      mudouDivisao;

    if (redividir) {
      await this.removerContasDivididas(lancamento, false);
      lancamento.lancamentos = [];
      const resultadoDivisao = this.lancamentoDivisaoService.dividirIgualmente(
        lancamento,
        lancamentoDto.divisao,
      );
      lancamento.valorDividido = resultadoDivisao.valorLancamentoOriginal;
      lancamento.divisaoId = resultadoDivisao.tipoDivisao;
      lancamento.lancamentos = resultadoDivisao.lancamentos;
    } else {
      const valorDividido =
        lancamento.valor / (lancamentoDto.divisao.pessoas.length + 1);
      lancamento.valorDividido = numberUtils.round(valorDividido);
      lancamento.lancamentos.forEach((relacionado) =>
        this.updateRelacionado(
          relacionado,
          lancamento,
          lancamento.valorDividido,
        ),
      );
    }

    await this.parcelaService.atualizar(
      lancamento,
      eraParcelado,
      parcelado,
      quantidadeParcelasOriginal,
      mesAtual,
    );
    await this.lancamentoRepository.save(lancamento);
  }

  private isOutraDivisao(
    lancamento: Lancamento,
    lancamentoDTO: LancamentoDTO,
  ): boolean {
    let mudouDivisao = false;
    const isDivididoIgualmente = lancamentoDTO?.divisao?.igualmente;
    const isDivididoDiferente = lancamentoDTO?.divisao?.diferente;

    if (
      (isDivididoIgualmente || isDivididoDiferente) &&
      lancamento.divisaoId == null
    ) {
      mudouDivisao = true;
    } else if (lancamento.divisaoId == 1 && isDivididoDiferente) {
      mudouDivisao = true;
    } else if (lancamento.divisaoId == 2 && isDivididoIgualmente) {
      mudouDivisao = true;
    }

    return mudouDivisao;
  }

  private osDevedoresMudaram(
    lancamento: Lancamento,
    lancamentoDTO: LancamentoDTO,
  ): boolean {
    const pessoasAtuais = [lancamento.pessoa.id];

    lancamento.lancamentos.forEach((lan) => {
      pessoasAtuais.push(lan.pessoa.id);
    });

    if (lancamentoDTO.divisao && lancamento.divisaoId == null) {
      return true;
    } else if (lancamentoDTO.divisao?.igualmente && lancamento.divisaoId == 1) {
      const novosIgual = [
        lancamentoDTO.idPessoa,
        lancamentoDTO?.divisao?.pessoas?.map((pessoa) => pessoa?.id),
      ].flat();

      if (pessoasAtuais.length != novosIgual.length) {
        return true;
      }

      novosIgual.filter((pessoaId) => !pessoasAtuais.includes(pessoaId));
      return novosIgual.length > 0;
    } else if (lancamentoDTO.divisao?.diferente && lancamento.divisaoId == 2) {
      const novos = [
        lancamentoDTO.idPessoa,
        lancamentoDTO?.divisao?.pessoas?.map((pessoa) => pessoa?.id),
      ].flat();

      if (pessoasAtuais.length != novos.length) {
        return true;
      }

      novos.filter((pessoaId) => !pessoasAtuais.includes(pessoaId));
      return novos.length > 0;
    }

    return false;
  }

  private async removerContasDivididas(
    lancamento: Lancamento,
    removerTudo: boolean,
  ): Promise<void> {
    if (removerTudo) {
      const toDelete: Lancamento[] = [...lancamento.lancamentos, lancamento];
      await this.lancamentoRepository.remove(toDelete);
    } else {
      lancamento.divisaoId = null;
      lancamento.valorDividido = null;
      await this.lancamentoRepository.deleteByLancamentoRelacionado(lancamento);
    }
  }

  private updateRelacionado(
    relacionado: Lancamento,
    lancamento: Lancamento,
    valorDividido: number,
  ) {
    relacionado.nome = lancamento.nome;
    relacionado.descricao = lancamento.descricao;
    relacionado.valor = lancamento.valor;
    relacionado.formaPagamento = lancamento.formaPagamento;
    relacionado.parcelado = lancamento.parcelado;
    relacionado.quantidadeParcelas = lancamento.quantidadeParcelas;
    relacionado.tipoConta = lancamento.tipoConta;
    relacionado.mes = lancamento.mes;
    relacionado.divisaoId = lancamento.divisaoId;
    relacionado.valorDividido = valorDividido;
  }

  private async atualizarDiferente(
    lancamento: Lancamento,
    lancamentoDto: LancamentoDTO,
    parcelado: boolean,
    mesAtual: Mes,
  ): Promise<void> {
    const mudouDivisao = this.isOutraDivisao(lancamento, lancamentoDto);

    const eraParcelado = lancamento.parcelado;
    const quantidadeParcelasOriginal = eraParcelado
      ? lancamento.quantidadeParcelas
      : 0;
    const redividir =
      this.osDevedoresMudaram(lancamento, lancamentoDto) ||
      lancamento.lancamentos.length === 0 ||
      mudouDivisao;

    await this.newValuesToConta(lancamento, lancamentoDto);

    if (redividir) {
      await this.removerContasDivididas(lancamento, false);

      lancamento.lancamentos = [];

      const resultadoDivisao = this.lancamentoDivisaoService.dividirDiferente(
        lancamento,
        lancamentoDto.divisao,
      );

      lancamento.lancamentos = resultadoDivisao.lancamentos;

      lancamento.valorDividido = resultadoDivisao.valorLancamentoOriginal;

      lancamento.divisaoId = resultadoDivisao.tipoDivisao;
    } else {
      const valorTotalDivisao = numberUtils.somar(
        lancamentoDto?.divisao?.pessoas?.map((p) => p?.valor),
      );
      const isValorDivididoMaiorLancamento =
        valorTotalDivisao > lancamentoDto.valor;

      if (isValorDivididoMaiorLancamento) {
        throw new BadRequestException(
          'O valor dividido do lançamento ultrapassou o valor total.',
        );
      }
      const finalConta = lancamento;

      lancamento.lancamentos.forEach((relacionado) => {
        const pessoaList = lancamentoDto.divisao.pessoas.filter(
          (p) => p.id === relacionado.pessoa.id,
        );

        const pessoa = pessoaList[0];
        this.updateRelacionado(relacionado, finalConta, pessoa.valor);
      });
      lancamento.valorDividido = numberUtils.round(
        lancamento.valorDividido - valorTotalDivisao,
      );
    }

    await this.parcelaService.atualizar(
      lancamento,
      eraParcelado,
      parcelado,
      quantidadeParcelasOriginal,
      mesAtual,
    );
    await this.lancamentoRepository.save(lancamento);
  }

  private async atualizarContaNormal(
    lancamento: Lancamento,
    lancamentoDto: LancamentoDTO,
    parcelado: boolean,
    mesAtual: Mes,
  ): Promise<void> {
    const eraParcelado: boolean = lancamento.isParcelado;

    const quantidadeParcelasOriginal: number | null =
      lancamento.quantidadeParcelas;

    await this.newValuesToConta(lancamento, lancamentoDto);

    if (
      lancamento.isDividido &&
      (!lancamentoDto.divisao ||
        !(
          lancamentoDto?.divisao?.igualmente ||
          lancamentoDto?.divisao?.diferente
        ))
    ) {
      await this.removerContasDivididas(lancamento, false);
      lancamento.lancamentos = [];
    }

    await this.parcelaService.atualizar(
      lancamento,
      eraParcelado,
      parcelado,
      quantidadeParcelasOriginal ?? 0,
      mesAtual,
    );
    await this.lancamentoRepository.save(lancamento);
  }

  private setTransactionsManager(entityManager: EntityManager) {
    this.parcelaService.setEntityManager(entityManager);
    this.lancamentoRepository.setEntityManager(entityManager);
  }

  private restoreTransactionsManagers() {
    this.lancamentoRepository.restoreCurrentManager();
    this.parcelaService.restoreCurrentManager();
  }
}
