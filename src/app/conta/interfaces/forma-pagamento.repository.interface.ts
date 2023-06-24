import { PessoaUsuarioAutenticadoDTO } from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { IRepository } from 'src/infra/interfaces/repository';
import { FormaPagamento } from '../models/forma-pagamento.entity';

export interface IFormaPagamentoRepository extends IRepository<FormaPagamento> {
  buscarFormasPagamentosAtivasAdmin(): Promise<FormaPagamento[]>;
  buscarFormasPagamentosDono(idPessoa: number): Promise<FormaPagamento[]>;
  buscarFormasPagamentosComCompras(
    mesReferencia: number,
    anoReferencia: number,
    pessoa?: Pessoa | PessoaUsuarioAutenticadoDTO,
  ): Promise<FormaPagamento[]>;
}
