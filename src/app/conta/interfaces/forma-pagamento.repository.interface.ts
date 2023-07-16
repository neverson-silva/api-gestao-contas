import { PessoaUsuarioAutenticadoDTO } from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { FormaPagamento } from '@app/conta/models/forma-pagamento.entity';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { IRepository } from '@infra/interfaces/repository';

export interface IFormaPagamentoRepository extends IRepository<FormaPagamento> {
  buscarFormasPagamentosAtivasAdmin(): Promise<FormaPagamento[]>;
  buscarFormasPagamentosDono(idPessoa: number): Promise<FormaPagamento[]>;
  buscarFormasPagamentosComCompras(
    mesReferencia: number,
    anoReferencia: number,
    pessoa?: Pessoa | PessoaUsuarioAutenticadoDTO,
  ): Promise<FormaPagamento[]>;
}
