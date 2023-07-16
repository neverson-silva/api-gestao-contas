import { IPessoaRepository } from '@app/pessoa/interfaces/pessoa.repository.interface';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class PessoaRepository
  extends Repository<Pessoa>
  implements IPessoaRepository
{
  constructor(entityManager: EntityManager) {
    super(Pessoa, entityManager);
  }
}
