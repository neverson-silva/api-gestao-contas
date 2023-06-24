import { PessoaUsuarioAutenticadoDTO } from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { IFormaPagamentoRepository } from '@app/conta/interfaces/forma-pagamento.repository.interface';
import { IFormaPagamentoService } from '@app/conta/interfaces/forma-pagamento.service.interface';
import { FormaPagamento } from '@app/conta/models/forma-pagamento.entity';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FormaPagamentoService implements IFormaPagamentoService {
  constructor(
    @Inject('IFormaPagamentoRepository')
    private readonly formaPagamentoRepository: IFormaPagamentoRepository,
  ) {}
  async buscarFormasPagamentosAtivasAdmin(): Promise<FormaPagamento[]> {
    return await this.formaPagamentoRepository.buscarFormasPagamentosAtivasAdmin();
  }

  async buscarFormasPagamentosDono(
    idPessoa: number,
  ): Promise<FormaPagamento[]> {
    return await this.formaPagamentoRepository.buscarFormasPagamentosDono(
      idPessoa,
    );
  }

  async buscarFormasPagamentosComCompras(
    mesReferencia: number,
    anoReferencia: number,
    pessoa?: Pessoa | PessoaUsuarioAutenticadoDTO,
  ): Promise<FormaPagamento[]> {
    return await this.formaPagamentoRepository.buscarFormasPagamentosComCompras(
      mesReferencia,
      anoReferencia,
      pessoa,
    );
  }
}
