import { Pessoa } from '@app/pessoa/models/pessoa.entity';

export class PessoaComValorDespesaDto extends Pessoa {
  valorTotal: number;

  constructor(valorTotal: number, obj?: Pessoa) {
    super();
    this.valorTotal = valorTotal;
    Object.assign(this, obj);
  }
}
