import { Inject, Injectable } from '@nestjs/common';
import { Lancamento } from '@app/conta/models/lancamento.entity';
import { Parcela } from '@app/conta/models/parcela.entity';
import { IParcelaService } from '@app/conta/interfaces/parcela.service.interface';
import { Mes } from '@app/conta/models/mes.entity';
import { FaturaAberta } from '@app/conta/models/fatura-aberta.entity';
import { Parcelamento } from '@app/conta/dtos/parcelamento';
import { IParcelaRepository } from '@app/conta/interfaces/parcela.repository.interface';
import { FechamentoFaturaException } from '@app/conta/fechamento-fatura.exception';
import { EntityManager } from 'typeorm';

@Injectable()
export class ParcelaService implements IParcelaService {
  private cachedManager: EntityManager;

  constructor(
    @Inject('IParcelaRepository')
    private readonly parcelaRepository: IParcelaRepository,
  ) {}

  storeCurrentManager() {
    this.cachedManager = this.parcelaRepository.manager;
  }
  restoreCurrentManager() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.parcelaRepository['manager'] = this.cachedManager;
  }
  setEntityManager(em: EntityManager): EntityManager {
    this.storeCurrentManager();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.parcelaRepository['manager'] = em;
    return em;
  }
  getEntityManager(): EntityManager {
    return this.parcelaRepository.manager;
  }

  static createMockParcela(lancamento: Lancamento, parcela: Parcela): Parcela {
    const parcel = new Parcela();

    parcel.id = lancamento.id * parcela.id;
    parcel.vencimento =
      lancamento.formaPagamento?.diaVencimento ?? parcela.vencimento;
    parcel.numero = parcela.numero;
    parcel.valor = lancamento.valorPorParcela;

    if (parcela.pago) {
      parcel.valorPago = parcel.valor;
    }
    parcel.lancamento = lancamento;
    parcel.pago = parcela.pago;
    parcel.atual = parcela.atual;
    parcel.mes = parcela.mes;
    parcel.ano = parcela.ano;
    parcel.createdAt = parcela.createdAt;
    parcel.updatedAt = parcela.updatedAt;

    return parcel;
  }

  async atualizar(
    lancamento: Lancamento,
    eraParcelado: boolean,
    atualmenteParceladoOrParcelado: boolean,
    quantidadeParcelasOriginal: number,
    mesAtual?: Mes,
  ): Promise<void> {
    if (atualmenteParceladoOrParcelado) {
      if (eraParcelado) {
        await this.reparcelar(
          lancamento,
          quantidadeParcelasOriginal,
          mesAtual as Mes,
        );
      } else {
        const parcelamentos = lancamento.lancamentos.map(
          (lanc) => new Parcelamento(lanc, mesAtual as Mes),
        );
        parcelamentos.push(new Parcelamento(lancamento, mesAtual as Mes));
        this.parcelar(parcelamentos);
      }
    } else if (eraParcelado) {
      await this.parcelaRepository.apagarTudoPorLancamento(lancamento);
      await this.parcelaRepository.apagarTudoRelacionadoPorLancamentoId(
        lancamento.id,
      );
    }
  }

  async atualizarEstado(lancamento: FaturaAberta): Promise<void> {
    const parcela = lancamento.parcela;
    const conta = lancamento.lancamento;
    const quantidadeParcelas = conta.quantidadeParcelas;

    try {
      if (parcela.pago) {
        if (parcela.numero === quantidadeParcelas) {
          await this.atualizarParcelaPagarConta(conta, parcela);
        } else if (parcela.numero < quantidadeParcelas) {
          await this.pagarParcelasAnteriores(parcela);
          await this.avancarParcela(parcela);
        }
      } else {
        if (parcela.numero === 1) {
          await this.garantirPrimeiraParcelaAtiva(parcela);
        } else if (parcela.numero === quantidadeParcelas) {
          parcela.pago = false;
          parcela.valorPago = null;
          parcela.atual = true;
          parcela.updatedAt = new Date();
          await this.parcelaRepository.save(parcela);
        } else if (parcela.numero < quantidadeParcelas) {
          await this.desativarParcelasFuturasDefinirAtual(parcela);
        }
        conta.pago = false;
        // await this.lancamentoRepository.save(conta);
      }
    } catch (e) {
      throw new FechamentoFaturaException(
        `Erro ao atualizar estado da parcela: ${lancamento.parcela.id}: ${e.message}`,
      );
    }
  }

  parcelar(parcelamentos: Parcelamento[]): void;
  parcelar(parcelamento: Parcelamento): void;
  parcelar(parcelamentos: Parcelamento[] | Parcelamento): void {
    const parcelador = (pParcelamento: Parcelamento) => {
      const parcelas: Parcela[] = [];
      const quantidadeParcelas = pParcelamento.getParcelasCriar();
      const start = pParcelamento.getStart();

      for (let numero = start; numero <= quantidadeParcelas; numero++) {
        parcelas.push(this.create(numero, pParcelamento, true));
      }

      pParcelamento.lancamento.parcelas = parcelas;
      return pParcelamento;
    };

    if (Array.isArray(parcelamentos)) {
      parcelamentos.forEach((parcelamento) => parcelador(parcelamento));
    } else {
      parcelador(parcelamentos);
    }
  }

  async reparcelar(
    lancamento: Lancamento,
    quantidadeParcelasOriginal: number,
    mesAtual: Mes,
  ): Promise<void> {
    const parcelamentos = [new Parcelamento(lancamento, mesAtual)];

    await this.parcelaRepository.apagarTudoPorLancamento(lancamento);
    lancamento.parcelas = [];

    if (lancamento.isDividido) {
      await this.parcelaRepository.apagarTudoRelacionadoPorLancamentoId(
        lancamento.id,
      );
      parcelamentos.push(
        ...lancamento.lancamentos.map((lanc) => {
          lanc.parcelas = [];
          return new Parcelamento(lanc, mesAtual);
        }),
      );
    }

    this.parcelar(parcelamentos);
  }

  setParcelaAtual(parcela: Parcela): boolean {
    return false;
  }

  private async atualizarParcelaPagarConta(
    conta: Lancamento,
    parcela: Parcela,
  ): Promise<void> {
    parcela.pago = true;
    parcela.valorPago = parcela.valor;
    parcela.atual = false;
    parcela.updatedAt = new Date();

    await this.parcelaRepository.save(parcela);
    conta.pago = true;
    // await this.lancamentoRepository.save(conta);
  }

  private async pagarParcelasAnteriores(parcela: Parcela): Promise<void> {
    await this.parcelaRepository.pagarParcelasAnteriores(
      parcela.lancamento,
      parcela.numero,
      parcela.valor,
      new Date(),
    );
  }

  private async avancarParcela(parcela: Parcela): Promise<void> {
    await this.parcelaRepository.avancarParcela(
      parcela.lancamento,
      parcela.numero + 1,
      new Date(),
    );
  }

  private async garantirPrimeiraParcelaAtiva(parcela: Parcela): Promise<void> {
    await this.parcelaRepository.reabrirTodasParcelas(
      parcela.lancamento,
      new Date(),
    );
    parcela.atual = true;
    parcela.updatedAt = new Date();
    await this.parcelaRepository.save(parcela);
  }

  private async desativarParcelasFuturasDefinirAtual(
    parcela: Parcela,
  ): Promise<void> {
    await this.parcelaRepository.desativarParcelasFuturasDefinirAtual(
      parcela.lancamento,
      parcela.numero,
      new Date(),
    );
    parcela.atual = true;
    parcela.valorPago = null;
    parcela.updatedAt = new Date();
    await this.parcelaRepository.save(parcela);
  }

  private create(
    numero: number,
    parcelamento: Parcelamento,
    shouldIncrement: boolean,
  ): Parcela {
    const atual = parcelamento.checkIsAtual(numero);
    const pago = parcelamento.checkIsPago(numero);
    const vencimento =
      parcelamento.lancamento?.formaPagamento?.diaVencimento ?? 9;
    const parcela = new Parcela({
      vencimento,
      numero,
      pago,
      atual,
      lancamento: parcelamento.lancamento,
      valor: parcelamento.getValorPorParcela(),
      valorPago: pago ? parcelamento.getValorPorParcela() : 0,
    });
    parcela.mes = new Mes(parcelamento.getMesAno().mesReferencia);
    parcela.ano = parcelamento.getMesAno().anoReferencia;

    if (shouldIncrement) {
      parcelamento.setMesAno(
        parcelamento.getMesAno().mesReferencia,
        parcelamento.getMesAno().anoReferencia,
      );
    }

    return parcela;
  }
}
