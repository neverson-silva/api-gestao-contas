export class ResumoFormaPagamentoMensalDTO {
  titulo: string;
  valor: number;
  porcentagem: number;
  corIcone: string;

  constructor(dto?: Partial<ResumoFormaPagamentoMensalDTO>) {
    if (dto) {
      Object.assign(this, dto);
    }
  }
}
