import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { IPessoaCorGraficoRepository } from '../interfaces/pessoa-cor-grafico.repository.interface';
import { PessoaCorGrafico } from '../models/pessoa-cor-grafico.entity';

@Injectable()
export class PessoaCorGraficoRepository
  extends Repository<PessoaCorGrafico>
  implements IPessoaCorGraficoRepository
{
  constructor(em: EntityManager) {
    super(PessoaCorGrafico, em);
  }
  async obterTudo(): Promise<PessoaCorGrafico[]> {
    const pessoasCorGrafico = await this.find({
      join: {
        alias: 'pcg',
        innerJoinAndSelect: {
          pessoa: 'pcg.pessoa',
        },
      },
      order: {
        id: 'ASC',
      },
    });
    return pessoasCorGrafico;
  }
}
