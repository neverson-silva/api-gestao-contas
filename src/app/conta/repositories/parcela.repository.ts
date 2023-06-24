import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { IParcelaRepository } from '../interfaces/parcela.repository.interface';
import { Parcela } from '../models/parcela.entity';
import { Lancamento } from '@app/conta/models/lancamento.entity';

@Injectable()
export class ParcelaRepository
  extends Repository<Parcela>
  implements IParcelaRepository
{
  private cachedEntityManager: EntityManager;

  constructor(em: EntityManager) {
    super(Parcela, em);
  }

  async apagarTudoPorLancamento(lancamento: Lancamento): Promise<void> {
    await this.createQueryBuilder('p')
      .innerJoin('p.lancamento', 'lancamento')
      .where('lancamento.id = :lancamento', { lancamento: lancamento.id })
      .delete()
      .execute();
  }

  async apagarTudoRelacionadoPorLancamentoId(id: number): Promise<void> {
    const query = `
    DELETE FROM parcelas
    WHERE parcelas.conta_id IN (
      SELECT c.conta_id FROM (
        SELECT DISTINCT cc.conta_id AS conta_id
        FROM contas cc
        INNER JOIN parcelas p ON p.conta_id = cc.conta_id
        WHERE cc.conta_id_relacionado = $1
      ) AS c
    )
  `;

    return await this.query(query, [id]);
  }

  async avancarParcela(
    lancamento: Lancamento,
    number: number,
    date: Date,
  ): Promise<void> {
    await this.createQueryBuilder('p')
      .innerJoin('p.lancamento', 'lancamento')
      .where('lancamento.id = :lancamento', { lancamento: lancamento.id })
      .andWhere('numero = :number', { number })
      .update()
      .set({
        pago: false,
        valorPago: null,
        atual: true,
        updatedAt: date,
      })
      .execute();
  }

  async desativarParcelasFuturasDefinirAtual(
    lancamento: Lancamento,
    numero: number,
    date: Date,
  ): Promise<void> {
    await this.createQueryBuilder('p')
      .innerJoin('p.lancamento', 'lancamento')
      .where('lancamento.id = :lancamento', { lancamento: lancamento.id })
      .andWhere('numero >= :numero', { numero })
      .update()
      .set({
        pago: false,
        valorPago: null,
        atual: false,
        updatedAt: date,
      })
      .execute();
  }

  getEntityManager(): EntityManager {
    return this.manager;
  }

  async pagarParcelasAnteriores(
    lancamento: Lancamento,
    numero: number,
    valor: number,
    dataAtualizacao: Date,
  ): Promise<void> {
    await this.createQueryBuilder('p')
      .innerJoin('p.lancamento', 'lancamento')
      .where('lancamento.id = :lancamento', { lancamento: lancamento.id })
      .andWhere('numero <= :numero', { numero })
      .update()
      .set({
        pago: true,
        valorPago: valor,
        atual: false,
        updatedAt: dataAtualizacao,
      })
      .execute();
  }

  async reabrirTodasParcelas(
    lancamento: Lancamento,
    date: Date,
  ): Promise<void> {
    await this.createQueryBuilder('p')
      .innerJoin('p.lancamento', 'lancamento')
      .where('lancamento.id = :lancamento', { lancamento: lancamento.id })
      .update()
      .set({
        pago: false,
        valorPago: null,
        atual: false,
        updatedAt: date,
      })
      .execute();
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

  storeCurrentManager() {
    this.cachedEntityManager = this.manager;
  }
}
