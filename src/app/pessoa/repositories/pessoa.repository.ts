import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { IPessoaRepository } from '../interfaces/pessoa.repository.interface';
import { Pessoa } from '../models/pessoa.entity';

@Injectable()
export class PessoaRepository
  extends Repository<Pessoa>
  implements IPessoaRepository
{
  constructor(entityManager: EntityManager) {
    super(Pessoa, entityManager);
  }
}
