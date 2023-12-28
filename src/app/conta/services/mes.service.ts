import { IMesService } from '@app/conta/interfaces/mes.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { IMesRepository } from '@app/conta/interfaces/mes.repository.interface';
import {
  EFormaPagamento,
  FormaPagamento,
} from '@app/conta/models/forma-pagamento.entity';
import { Mes } from '@app/conta/models/mes.entity';
import * as moment from 'moment';
import { EAppProviders } from '@infra/enums/app-providers.enum';

@Injectable()
export class MesService implements IMesService {
  constructor(
    @Inject(EAppProviders.MES_REPOSITORY)
    private readonly mesRepository: IMesRepository,
  ) {}

  async getFromDataCompraAndFormaPagamento(
    dataCompra: Date,
    formaPagamento: FormaPagamento,
  ): Promise<Mes> {
    const mesAtual = await this.mesRepository.findOneBy({ atual: true });

    const hoje = new Date();
    const mesCompra = dataCompra.getMonth() + 1;

    const ultimoDiaMesDataCompra = moment(dataCompra)
      .endOf('month')
      .toDate()
      .getDate();

    if (
      [EFormaPagamento.DINHEIRO, EFormaPagamento.CARNE].includes(
        formaPagamento.id,
      )
    ) {
      return new Mes(mesCompra);
    }

    if (
      formaPagamento.nome.toLowerCase().includes('nubank') &&
      mesAtual.id + 1 === mesCompra &&
      hoje.getDate() <= 3
    ) {
      return mesAtual;
    } else if (
      dataCompra.getDate() <= 3 &&
      formaPagamento.nome.toLowerCase().includes('nubank')
    ) {
      const newMes = new Date(
        dataCompra.getFullYear(),
        dataCompra.getMonth() - 1,
      );
      return new Mes(newMes.getMonth() + 1);
    } else if (
      ultimoDiaMesDataCompra === dataCompra.getDate() &&
      !formaPagamento.nome.toLowerCase().includes('nubank')
    ) {
      const newMes = new Date(
        dataCompra.getFullYear(),
        dataCompra.getMonth() + 1,
      );
      return new Mes(newMes.getMonth() + 1);
    } else if (mesAtual.id === mesCompra) {
      return mesAtual;
    }

    return new Mes(mesCompra);
  }

  async buscarMesAtual(): Promise<Mes> {
    return await this.mesRepository.findOneBy({ atual: true });
  }

  async buscarPorId(id: number): Promise<Mes> {
    return await this.mesRepository.findOneBy({ id: id });
  }
}
