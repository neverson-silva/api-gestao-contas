import { PessoaUsuarioAutenticadoDTO } from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { FaturaItem } from '@app/fatura/models/fatura-item.entity';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { IFormaPagamentoRepository } from '../interfaces/forma-pagamento.repository.interface';
import { FormaPagamento } from '../models/forma-pagamento.entity';

@Injectable()
export class FormaPagamentoRepository
  extends Repository<FormaPagamento>
  implements IFormaPagamentoRepository
{
  constructor(em: EntityManager) {
    super(FormaPagamento, em);
  }
  async buscarFormasPagamentosAtivasAdmin(): Promise<FormaPagamento[]> {
    return await this.find({ where: { ativo: true }, order: { nome: 'ASC' } });
  }
  async buscarFormasPagamentosDono(
    idPessoa: number,
  ): Promise<FormaPagamento[]> {
    return await this.find({
      where: {
        ativo: true,
        dono: {
          id: idPessoa,
        },
      },
      order: { nome: 'ASC' },
      relations: ['dono'],
    });
  }
  async buscarFormasPagamentosComCompras(
    mesReferencia: number,
    anoReferencia: number,
    pessoa?: Pessoa | PessoaUsuarioAutenticadoDTO,
  ): Promise<FormaPagamento[]> {
    const builder = this.createQueryBuilder('fp');

    const query = builder.leftJoinAndSelect('fp.dono', 'dono').whereExists(
      builder
        .subQuery()
        .from(FaturaItem, 'fi')
        .leftJoin('fi.lancamento', 'lancamento')
        .leftJoin('lancamento.formaPagamento', 'formaPagamento')
        .leftJoin('lancamento.pessoa', 'pessoa')
        .where('formaPagamento.id = fp.id')
        .andWhere('fi.fechamento = :mesReferencia', {
          mesReferencia,
        })
        .andWhere('fi.ano = :anoReferencia', {
          anoReferencia,
        })
        .andWhere('pessoa.id = coalesce(:idPessoa, pessoa.id)', {
          idPessoa: pessoa?.id,
        }),
    );
    const formasPagamentos = await query.orderBy('fp.nome', 'ASC').getMany();
    return formasPagamentos;
  }
}
