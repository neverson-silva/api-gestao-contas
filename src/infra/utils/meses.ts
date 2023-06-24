import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import { Mes } from '@app/conta/models/mes.entity';

export class MesUtils {
  meses = new Map<number, string>([
    [1, 'Jan'],
    [2, 'Fev'],
    [3, 'Mar'],
    [4, 'Abr'],
    [5, 'Mai'],
    [6, 'Jun'],
    [7, 'Jul'],
    [8, 'Ago'],
    [9, 'Set'],
    [10, 'Out'],
    [11, 'Nov'],
    [12, 'Dez'],
  ]);

  nome(id: number): string {
    return this.meses.get(id) ?? '';
  }

  getMesAno(mes: Mes): MesAnoDTO;
  getMesAno(mes: number): MesAnoDTO;
  getMesAno(mes: number, ano: number): MesAnoDTO;
  // getMesAno(mes: Mes, ano: number): MesAnoDTO;
  getMesAno(mes: Mes, ano?: number): MesAnoDTO;
  getMesAno(mes: Mes | number, ano?: number): MesAnoDTO {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const isNumberMes = typeof mes === 'number';

    const paramMesId = isNumberMes ? mes : mes.id;

    if (mesAtual === 1 && paramMesId === 12 && hoje.getFullYear() >= ano) {
      ano = hoje.getFullYear() - 1;
    }

    return new MesAnoDTO({
      mesReferencia: paramMesId,
      anoReferencia: ano ?? hoje.getFullYear(),
      mes: isNumberMes ? ({ id: mes } as Mes) : mes,
    });
  }

  getMesAnoReferencia({
    mes,
    ano,
    isParcelamento,
  }: {
    mes: Mes | number;
    ano?: number;
    isParcelamento?: boolean;
  }): MesAnoDTO {
    const hoje = new Date();
    const isMesNumber = typeof mes === 'number';

    let mesReferencia = isMesNumber ? mes : mes.id;
    ano = ano ?? hoje.getUTCFullYear();

    if (
      (mesReferencia === 12 &&
        hoje.getMonth() !== mesReferencia - 1 &&
        ano < hoje.getFullYear()) ||
      (mesReferencia === 12 &&
        ano === hoje.getFullYear() &&
        hoje.getMonth() === 0)
    ) {
      mesReferencia = 1;

      ano = isParcelamento ? ano + 1 : ano < hoje.getFullYear() ? ano + 1 : ano;
    } else if (mesReferencia === 12) {
      ano += 1;
      mesReferencia = 1;
    } else if (mesReferencia === 1 && ano < hoje.getFullYear()) {
      mesReferencia += 1;
      ano += 1;
    } else {
      mesReferencia += 1;
    }

    return new MesAnoDTO({
      mesReferencia,
      anoReferencia: ano,
      mes: isMesNumber ? ({ id: mes } as Mes) : mes,
    });
  }

  getMesAnoAnterior(mesAno: MesAnoDTO): MesAnoDTO {
    if (mesAno.mes == null) {
      mesAno.mes = new Mes(mesAno.mesReferencia);
    }
    let mes = mesAno.mesReferencia;
    let ano = mesAno.anoReferencia;
    const hoje = new Date();

    if (
      (mesAno.mes?.id ?? mesAno.mesReferencia) === 12 &&
      hoje.getMonth() === 0
    ) {
      mes = 11;
      ano = hoje.getFullYear() - 1;
    } else if ((mesAno.mes?.id ?? mesAno.mesReferencia) === 1) {
      ano = hoje.getFullYear() - 1;
      mes = 12;
    } else {
      mes -= 1;
    }

    return new MesAnoDTO({
      mesReferencia: mes,
      anoReferencia: ano,
      mes: null,
    });
  }

  getMesAnoAnteriores(mes: number, ano: number): MesAnoDTO {
    if (mes === 1) {
      mes = 12;
      ano -= 1;
    } else {
      mes -= 1;
    }
    return new MesAnoDTO({
      mesReferencia: mes,
      anoReferencia: ano,
      mes: null,
    });
  }
}

export const mesUtil = new MesUtils();
