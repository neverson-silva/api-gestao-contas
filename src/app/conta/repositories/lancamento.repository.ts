import { ILancamentoRepository } from '@app/conta/interfaces/lancamento.repository.interface';
import { Lancamento } from '@app/conta/models/lancamento.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class LancamentoRepository
  extends Repository<Lancamento>
  implements ILancamentoRepository
{
  private cachedEntityManager: EntityManager;

  constructor(em: EntityManager) {
    super(Lancamento, em);
  }

  storeCurrentManager() {
    this.cachedEntityManager = this.manager;
  }
  restoreCurrentManager() {
    if (this.cachedEntityManager) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this['manager'] = this.cachedEntityManager;
    }
  }
  setEntityManager(em: EntityManager): EntityManager {
    this.storeCurrentManager();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this['manager'] = em;
    return this.getEntityManager();
  }
  getEntityManager(): EntityManager {
    return this.manager;
  }

  async buscarCompleto(idLancamento: number): Promise<Lancamento> {
    const lancamento = await this.createQueryBuilder('lancamento')
      .leftJoinAndSelect('lancamento.mes', 'mes')
      .leftJoinAndSelect('lancamento.pessoa', 'pessoa')
      .leftJoinAndSelect('lancamento.formaPagamento', 'formaPagamento')
      .leftJoinAndSelect(
        'lancamento.lancamentoRelacionado',
        'lancamentoRelacionado',
      )
      .leftJoinAndSelect('lancamento.lancamentos', 'lancamentos')
      .leftJoinAndSelect('lancamentos.mes', 'mesLancamentos')
      .leftJoinAndSelect('lancamentos.pessoa', 'pessoaLancamentos')
      .leftJoinAndSelect(
        'lancamentos.formaPagamento',
        'formaPagamentoLancamentos',
      )
      .where('lancamento.id = :idLancamento', { idLancamento })
      .getOne();
    return lancamento;
  }

  async deleteByLancamentoRelacionado(lancamento: Lancamento): Promise<void> {
    const query = this.createQueryBuilder('lancamento')
      .leftJoin('lancamento.lancamentoRelacionado', 'lancamentoRelacionado')
      .delete()
      .where('lancamentoRelacionado.id = :idLancamento', {
        idLancamento: lancamento.id,
      });
    await query.execute();
  }
}
