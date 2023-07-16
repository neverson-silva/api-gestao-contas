import { MesAnoChartDTO } from '@app/conta/dtos/mes-ano-chart.dto';
import { IResumoFaturaRepository } from '@app/conta/interfaces/resumo-fatura.repository.interface';
import { ResumoFatura } from '@app/conta/models/resumo-fatura.entity';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ResumoFaturaRepository
  extends Repository<ResumoFatura>
  implements IResumoFaturaRepository
{
  constructor(em: EntityManager) {
    super(ResumoFatura, em);
  }

  async findAllBydMesAndAno(mes: number, ano: number): Promise<ResumoFatura[]> {
    const query = this.createQueryBuilder('rf')
      .innerJoinAndSelect('rf.formaPagamento', 'formaPagamento')
      .innerJoinAndSelect('rf.pessoa', 'pessoa')
      .leftJoinAndSelect('formaPagamento.dono', 'dono')
      .where('rf.mesId = :mesId', { mesId: mes })
      .andWhere('rf.ano = :ano', { ano });

    const resumosFaturas = await query.getMany();
    return resumosFaturas;
  }

  async findByMesAndAnoAndPessoas(
    mes: number,
    ano: number,
    idsPessoa: number[],
  ): Promise<ResumoFatura[]> {
    const query = this.createQueryBuilder('rf')
      .innerJoinAndSelect('rf.formaPagamento', 'formaPagamento')
      .innerJoinAndSelect('rf.pessoa', 'pessoa')
      .leftJoinAndSelect('formaPagamento.dono', 'dono')
      .where('rf.mesId = :mesId', { mesId: mes })
      .andWhere('rf.ano = :ano', { ano })
      .andWhere('rf.pessoaId in (:...idsPessoa)', {
        idsPessoa,
      });

    const resumosFaturas = await query.getMany();

    return resumosFaturas;
  }

  async findAllByPessoaIdAndMesAndAno(
    idPessoa: number,
    mes: number,
    ano: number,
  ): Promise<ResumoFatura[]> {
    const query = this.createQueryBuilder('rf')
      .innerJoinAndSelect('rf.formaPagamento', 'formaPagamento')
      .innerJoinAndSelect('rf.pessoa', 'pessoa')
      .leftJoinAndSelect('formaPagamento.dono', 'dono')
      .where('rf.pessoaId = :idPessoa', { idPessoa })
      .andWhere('rf.mesId = :mesId', { mesId: mes })
      .andWhere('rf.ano = :ano', { ano });

    const resumosFaturas = await query.getMany();
    return resumosFaturas;
  }

  async buscarResumoFaturasPorMesAnos(
    meses: MesAnoChartDTO[],
    pessoa: Pessoa,
  ): Promise<ResumoFatura[]> {
    const queryBuilder = this.createQueryBuilder('resumoFatura');
    queryBuilder
      .select('resumoFatura')
      .innerJoinAndSelect('resumoFatura.formaPagamento', 'formaPagamento')
      .innerJoinAndSelect('resumoFatura.pessoa', 'pessoa')
      .leftJoinAndSelect('formaPagamento.dono', 'dono')
      .where('1 = 1');

    const params: { [key: string]: any } = {};

    if (pessoa != null) {
      queryBuilder.andWhere('pessoa.id = :pessoaId', { pessoaId: pessoa.id });
    }

    const and = meses
      .map((mesAno, index) => {
        const mesPlaceholder = `:mes${index}`;
        const anoPlaceholder = `:ano${index}`;
        params[mesPlaceholder.substring(1)] = mesAno.fechamento;
        params[anoPlaceholder.substring(1)] = mesAno.anoFechamento;

        return ` ( resumoFatura.mesId = ${mesPlaceholder} and resumoFatura.ano = ${anoPlaceholder} ) `;
      })
      .join(' or \n');

    queryBuilder.andWhere(`( ${and} )`, params);

    const resumosFatura = await queryBuilder.getMany();

    return resumosFatura;
  }

  async buscarResumos(
    mes: number,
    ano: number,
    idFormaPagamento: number,
    idPessoa?: number,
  ): Promise<ResumoFatura[]> {
    const query = this.createQueryBuilder('rf')
      .innerJoinAndSelect('rf.pessoa', 'pessoa')
      .innerJoinAndSelect('rf.formaPagamento', 'formaPagamento')
      .leftJoinAndSelect('formaPagamento.dono', 'dono')
      .where('rf.mesId = :mes', { mes })
      .andWhere('rf.ano = :ano', { ano })
      .andWhere(
        'formaPagamento.id = coalesce(:idFormaPagamento, formaPagamento.id)',
        { idFormaPagamento },
      )
      .andWhere('pessoa.id = coalesce(:idPessoa, pessoa.id)', { idPessoa })
      .orderBy('pessoa.nome', 'ASC');

    const resumos = query.getMany();
    return resumos;
  }
}
