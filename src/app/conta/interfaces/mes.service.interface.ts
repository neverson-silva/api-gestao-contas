import { FormaPagamento } from '@app/conta/models/forma-pagamento.entity';
import { Mes } from '@app/conta/models/mes.entity';

export interface IMesService {
  getFromDataCompraAndFormaPagamento(
    dataCompra: Date,
    formaPagamento: FormaPagamento,
  ): Promise<Mes>;

  buscarMesAtual(): Promise<Mes>;

  buscarPorId(id: number): Promise<Mes>;
}
