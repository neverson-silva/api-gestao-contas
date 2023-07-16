import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { IRepository } from '@infra/interfaces/repository';

export type IPessoaRepository = IRepository<Pessoa>;
