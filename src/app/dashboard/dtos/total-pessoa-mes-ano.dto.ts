import { Pessoa } from '@app/pessoa/models/pessoa.entity';

export class TotalPessoaMesAnoDTO {
  idPessoa: number;
  nome: string;
  sobrenome: string;
  total: number;
  corBackground: string;
  corBorder: string;

  constructor(pessoa?: Pessoa, total?: number) {
    this.idPessoa = pessoa?.id || 0;
    this.nome = pessoa?.nome || '';
    this.sobrenome = pessoa?.sobrenome || '';
    this.total = total || 0;
  }
}
