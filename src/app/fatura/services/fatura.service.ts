import { Inject, Injectable, Logger } from '@nestjs/common';
import { IFaturaService } from '@app/fatura/interfaces/fatura.service.interface';
import { IFaturaItemRepository } from '@app/fatura/interfaces/fatura-item.repository.interface';
import { BuscarLancamentosFaturaRequestDTO } from '@app/fatura/dtos/buscar-lancamentos-fatura-request.dto';
import { AppPaginationDTO } from '@utils/dtos/pagination.dto';
import { Page } from '@utils/dtos/page.dto';
import { FaturaItem } from '@app/fatura/models/fatura-item.entity';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import { IMesRepository } from '@app/conta/interfaces/mes.repository.interface';
import {
  PessoaUsuarioAutenticadoDTO,
  UsuarioAutenticadoDto,
} from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { createPaginationOptions } from '@utils/index';
import { Lancamento } from '@app/conta/models/lancamento.entity';
import { ParcelaService } from '@app/conta/services/parcela.service';
import { IResumoFaturaRepository } from '@app/conta/interfaces/resumo-fatura.repository.interface';
import { numberUtils } from '@utils/number';
import { IPaginationOptions } from '@extensions/database/interfaces';
import { IFaturaAbertaRepository } from '@app/conta/interfaces/fatura-aberta.repository.interface';
import { mesUtil } from '@utils/meses';
import { EntityManager } from 'typeorm';
import { FaturaAberta } from '@app/conta/models/fatura-aberta.entity';
import { Mes } from '@app/conta/models/mes.entity';
import { IParcelaRepository } from '@app/conta/interfaces/parcela.repository.interface';
import { ILancamentoRepository } from '@app/conta/interfaces/lancamento.repository.interface';
import { ITotalPessoaService } from '@app/total-pessoa/interfaces/total-pessoa.service.interface';
import { FechamentoFaturaException } from '@app/conta/fechamento-fatura.exception';
import { IParcelaService } from '@app/conta/interfaces/parcela.service.interface';

@Injectable()
export class FaturaService implements IFaturaService {
  constructor(
    @Inject('IFaturaItemRepository')
    private readonly faturaItemRepository: IFaturaItemRepository,
    @Inject('IMesRepository')
    private readonly mesRepository: IMesRepository,
    @Inject('IResumoFaturaRepository')
    private readonly resumoFaturaRepository: IResumoFaturaRepository,
    @Inject('IFaturaAbertaRepository')
    private readonly faturaAbertaRepository: IFaturaAbertaRepository,
    @Inject('IParcelaRepository')
    private readonly parcelaRepository: IParcelaRepository,
    @Inject('ILancamentoRepository')
    private readonly lancamentoRepository: ILancamentoRepository,
    @Inject('ITotalPessoaService')
    private readonly totalPessoaService: ITotalPessoaService,

    @Inject('IParcelaService')
    private readonly parcelaService: IParcelaService,
  ) {}

  async buscarItensFaturaAtual(
    paginationDTO: AppPaginationDTO,
    usuario: UsuarioAutenticadoDto,
  ): Promise<Page<FaturaItem>> {
    const mes = await this.mesRepository.findOneBy({ atual: true });

    const mesAnoDto = new MesAnoDTO({
      mesReferencia: mes.id,
      anoReferencia: new Date().getFullYear(),
    });

    const buscarItensRequest = new BuscarLancamentosFaturaRequestDTO({
      ...paginationDTO,
    });

    buscarItensRequest.ano = mesAnoDto.anoReferencia;
    buscarItensRequest.mes = mesAnoDto.mesReferencia;
    buscarItensRequest.idPessoa = null;
    buscarItensRequest.orderBy = 'lancamento.dataCompra';

    return await this.buscarItensFatura(buscarItensRequest, usuario);
  }

  async buscarItensFatura(
    paramsRequest: BuscarLancamentosFaturaRequestDTO,
    usuario: UsuarioAutenticadoDto,
  ): Promise<Page<FaturaItem>> {
    const pageRequest = createPaginationOptions(paramsRequest);

    if (usuario.isAdmin() && !paramsRequest.idPessoa) {
      const itens: Page<FaturaItem> =
        await this.faturaItemRepository.getFaturaItemsByMesAno(
          paramsRequest.getMesAno(),
          paramsRequest.somenteAtivos ? paramsRequest.somenteAtivos : null,
          pageRequest,
          paramsRequest.searchKey ?? '',
          paramsRequest.idFormaPagamento,
        );

      const itensFatura = this.mapItensRelacionados(itens);
      return itensFatura;
    } else {
      const itens = await this.getFaturaItemsByMesAnoAndPessoa(
        paramsRequest.getMesAno(),
        usuario.isAdmin() ? new Pessoa(paramsRequest.idPessoa) : usuario.pessoa,
        pageRequest,
        paramsRequest.somenteAtivos,
        paramsRequest.searchKey ?? '',
        paramsRequest.idFormaPagamento,
      );
      return this.mapItensRelacionadosNotAdmin(itens);
    }
  }

  /*
   * @todo copiar to monolito em nestjs mesmo ta funcionando muito bem
   * */
  async fecharFatura(): Promise<void> {
    await this.faturaItemRepository.manager
      .transaction(async (transaction) => {
        this.startTransactions(transaction);

        Logger.log('Iniciando transação');
        Logger.log('Iniciando fechamento de fatura');

        const mesAtual = await this.mesRepository.findOneBy({ atual: true });

        const lancamentos = await this.faturaAbertaRepository.getAll();

        const mesAno = mesUtil.getMesAno(mesAtual);

        if (lancamentos.length > 0) {
          Logger.log('Salvando total pessoas');
          await this.totalPessoaService.salvarPessoas(mesAno);
          Logger.log('Total Pessoas Salvo com sucesso');

          Logger.log('Virada de mês iniciada');
          await this.virarMes(lancamentos, mesAtual);
          Logger.log('Virada de mês finalizada com sucesso');
          Logger.log('Transação finalizada');
        }

        this.restoreTransactions();
      })
      .catch((err) => {
        this.restoreTransactions();
        throw err;
      });
  }

  async somarTotalFatura(
    paginationDTO: BuscarLancamentosFaturaRequestDTO,
    usuario: UsuarioAutenticadoDto,
  ): Promise<number> {
    const pessoa = usuario.ifNotAdminGetPessoa();
    const resumos = await this.resumoFaturaRepository.buscarResumos(
      paginationDTO.mes,
      paginationDTO.ano,
      paginationDTO.idFormaPagamento,
      pessoa?.id,
    );
    return numberUtils.somar(resumos.map((resumo) => resumo.valorTotal));
  }

  private async getFaturaItemsByMesAnoAndPessoa(
    mesAno: MesAnoDTO,
    pessoa: Pessoa | PessoaUsuarioAutenticadoDTO,
    pageRequest: {
      pageOptions: IPaginationOptions;
      sortOptions?: { column: string; order: 'ASC' | 'DESC' };
    },
    somenteAtivos: boolean,
    searchKey: string,
    idFormaPagamento?: number,
  ): Promise<Page<FaturaItem>> {
    if (somenteAtivos) {
      return await this.faturaItemRepository.findAllByFechamentoAndAnoAndPessoaAndNotPago(
        mesAno.mesReferencia,
        mesAno.anoReferencia,
        pessoa,
        pageRequest,
        searchKey,
        idFormaPagamento,
      );
    }
    return await this.faturaItemRepository.findAllByFechamentoAndAnoAndPessoa(
      mesAno.mesReferencia,
      mesAno.anoReferencia,
      pessoa,
      pageRequest,
      searchKey,
      idFormaPagamento,
    );
  }

  private mapItensRelacionados(itens: Page<FaturaItem>): Page<FaturaItem> {
    itens.content.forEach((faturaItem) => {
      if (faturaItem.isDividido && faturaItem.hasLancamentosDivididos) {
        const itensRelacionados = this.buildFaturaItemRelacionado(
          faturaItem,
          faturaItem.lancamento.lancamentos,
        );

        faturaItem.itensRelacionados = [
          ...(faturaItem.itensRelacionados ?? []),
          ...itensRelacionados,
        ];
      }
    });
    return itens;
  }

  private buildFaturaItemRelacionado(
    faturaItem: FaturaItem,
    lancamentoList: Lancamento[],
  ): FaturaItem[] {
    const itensRelacionados: FaturaItem[] = [];

    lancamentoList.forEach((conta: Lancamento) => {
      if (conta.id !== faturaItem.lancamento.id) {
        try {
          const id: number = Math.floor(
            Math.random() * (faturaItem.id * 2 - faturaItem.id + 1) +
              faturaItem.id,
          );

          const fatItem: FaturaItem = new FaturaItem();
          fatItem.id = id;
          fatItem.fechamento = faturaItem.fechamento;
          fatItem.ano = faturaItem.ano;
          if (faturaItem.isParcelado) {
            fatItem.parcela = ParcelaService.createMockParcela(
              conta,
              faturaItem.parcela,
            );
          }
          conta.pessoa = { ...conta.pessoa } as Pessoa;
          fatItem.lancamento = conta;
          fatItem.pessoaId = conta.pessoa.id;

          itensRelacionados.push(fatItem);
        } catch (e) {
          console.log(e.getMessage());
        }
      }
    });

    return itensRelacionados;
  }

  private mapItensRelacionadosNotAdmin(
    itens: Page<FaturaItem>,
  ): Page<FaturaItem> {
    for (let i = 0; i < itens.content.length; i++) {
      const faturaItem = itens.content[i];
      if (faturaItem.dividido) {
        const lancamentos: Lancamento[] = [];
        if (faturaItem.principal && faturaItem.hasLancamentosDivididos) {
          lancamentos.push(...faturaItem.lancamento.lancamentos);
        } else if (faturaItem.lancamentoRelacionado?.hasLancamentosDivididos) {
          lancamentos.push(faturaItem.lancamentoRelacionado);
          lancamentos.push(...faturaItem.lancamentoRelacionado.lancamentos);
        }

        const itensRelacionados = this.buildFaturaItemRelacionado(
          faturaItem,
          lancamentos,
        );
        faturaItem.itensRelacionados = [
          ...(faturaItem.itensRelacionados ?? []),
          ...itensRelacionados,
        ];
      }
    }

    return itens;
  }

  private startTransactions(transaction: EntityManager) {
    this.lancamentoRepository.setEntityManager(transaction);
    this.parcelaRepository.setEntityManager(transaction);
    this.totalPessoaService.setEntityManager(transaction);
    this.mesRepository.setEntityManager(transaction);
  }

  private restoreTransactions() {
    this.lancamentoRepository.restoreCurrentManager();
    this.parcelaRepository.restoreCurrentManager();
    this.totalPessoaService.restoreCurrentManager();
    this.mesRepository.restoreCurrentManager();
  }

  private async virarMes(
    faturaAbertas: FaturaAberta[],
    mesAtual: Mes,
  ): Promise<void> {
    for (const faturaAberta of faturaAbertas) {
      try {
        const conta = faturaAberta.lancamento;

        if (conta.parcelado && !!faturaAberta.parcela) {
          faturaAberta.parcela.pago = true;
          faturaAberta.parcela.atual = false;
          faturaAberta.parcela.lancamento = conta;

          const isUltimaParcela =
            faturaAberta?.parcela?.numero ==
            faturaAberta?.lancamento?.quantidadeParcelas;

          if (isUltimaParcela) {
            conta.pago = true;
            await this.lancamentoRepository.save(conta);
          }
          await this.parcelaService.atualizarEstado(faturaAberta);
        } else {
          conta.pago = true;
          await this.lancamentoRepository.save(conta);
        }
      } catch (e) {
        if (e instanceof FechamentoFaturaException) {
          throw e;
        } else {
          throw new FechamentoFaturaException(
            `Erro ao virar mês: ${e.message} para o lançamento ${JSON.stringify(
              {},
            )}`,
          );
        }
      }
    }

    await this.mesRepository.update(mesAtual.id, { atual: false });
    if (mesAtual.id < 12) {
      await this.mesRepository.update(mesAtual.id + 1, { atual: true });
    } else {
      await this.mesRepository.update(1, { atual: true });
    }
  }
}
