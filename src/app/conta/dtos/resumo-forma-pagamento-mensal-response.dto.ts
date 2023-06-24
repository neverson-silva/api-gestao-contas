import { ResumoFormaPagamentoMensalDTO } from './resumo-forma-pagamento-mensal.dto';

export class ResumoFormaPagamentoMensalResponseDTO {
  cartao: ResumoFormaPagamentoMensalDTO;
  dinheiro: ResumoFormaPagamentoMensalDTO;
  parcelado: ResumoFormaPagamentoMensalDTO;
  total: ResumoFormaPagamentoMensalDTO;

  constructor(dto?: Partial<ResumoFormaPagamentoMensalResponseDTO>) {
    if (dto) {
      Object.assign(this, dto);
    }
  }
}
