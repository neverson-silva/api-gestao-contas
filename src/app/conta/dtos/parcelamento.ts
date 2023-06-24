import { Lancamento } from '@app/conta/models/lancamento.entity';
import { Mes } from '@app/conta/models/mes.entity';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import { mesUtil } from '@utils/meses';
import { numberUtils } from '@utils/number';

export class Parcelamento {
  lancamento: Lancamento;
  mesAtual: Mes;
  mesAno: MesAnoDTO;
  numeroInicial: number;
  atual: boolean;
  quantidade: number;
  hoje: Date;

  constructor(
    lancamento: Lancamento,
    mes: Mes,
    numeroInicial: number,
    isAtual: boolean,
    quantidade: number,
    mesId?: number,
    ano?: number,
  );
  constructor(lancamento: Lancamento, mes: Mes);
  constructor(
    lancamento: Lancamento,
    mes: Mes,
    numeroInicial?: number,
    isAtual?: boolean,
    quantidade?: number,
    mesId?: number,
    ano?: number,
  ) {
    this.lancamento = lancamento;
    this.mesAtual = mes;
    this.numeroInicial = numeroInicial || 1;
    this.atual = isAtual || true;
    this.quantidade = quantidade || lancamento.quantidadeParcelas;
    this.mesAno = mesUtil.getMesAnoReferencia({
      mes: mesId || lancamento.mes.id,
      ano: ano || lancamento.ano,
      isParcelamento: true,
    });
    this.hoje = new Date();
  }

  getStart(): number {
    if (this.numeroInicial === 1 && this.atual) {
      return 1;
    }
    return this.numeroInicial + 1;
  }

  getParcelasCriar(): number {
    if (this.numeroInicial === 1 && this.atual) {
      return this.quantidade;
    }
    return this.quantidade - this.numeroInicial;
  }

  getValorPorParcela(): number {
    return numberUtils.round(this.lancamento.valorUtilizado / this.quantidade);
  }

  getMesAno(): MesAnoDTO {
    if (!this.mesAno) {
      return mesUtil.getMesAnoReferencia({
        mes: this.mesAtual,
        isParcelamento: true,
      });
    }
    return this.mesAno;
  }

  setMesAno(mesAno: MesAnoDTO): void;
  setMesAno(mesId: number, ano: number): void;
  setMesAno(mesAnoOrId: MesAnoDTO | number, ano?: number): void {
    if (typeof mesAnoOrId === 'number') {
      this.mesAno = mesUtil.getMesAnoReferencia({
        mes: mesAnoOrId,
        ano,
        isParcelamento: true,
      });
    } else {
      this.mesAno = mesAnoOrId;
    }
  }

  checkIsAtual(numero: number): boolean {
    let atual = false;
    const ano = this.mesAno.anoReferencia;
    const mesId = this.mesAno.mesReferencia;

    if (ano === this.hoje.getFullYear() && mesId - 1 === this.mesAtual.id) {
      atual = true;
    } else if (
      mesId === 1 &&
      ano === this.hoje.getFullYear() &&
      this.mesAtual.id === 12 &&
      this.atual
    ) {
      atual = true;
    } else if (
      ano === this.hoje.getFullYear() &&
      mesId - 1 < this.mesAtual.id
    ) {
      atual = false;
    } else {
      atual =
        numero !== null ? this.getStart() === numero : this.getStart() === 1;
    }

    return atual;
  }

  checkIsPago(numero: number): boolean {
    let pago = false;
    const ano = this.mesAno.anoReferencia;
    const mesId = this.mesAno.mesReferencia;

    if (
      mesId === 1 &&
      ano === this.hoje.getFullYear() &&
      this.mesAtual.id === 12 &&
      this.atual
    ) {
      pago = false;
    } else if (
      ano === this.hoje.getFullYear() &&
      mesId - 1 === this.mesAtual.id
    ) {
      pago = false;
    } else if (
      this.mesAtual.id === 12 &&
      ano === this.hoje.getFullYear() &&
      mesId > this.hoje.getMonth() + 1
    ) {
      pago = false;
    } else if (
      ano === this.hoje.getFullYear() &&
      mesId - 1 < this.mesAtual.id
    ) {
      pago = true;
    } else {
      pago = this.numeroInicial > this.getStart();
    }

    return pago;
  }
}
