import { IRepository } from 'src/infra/interfaces/repository';
import { Pessoa } from '../models/pessoa.entity';

export type IPessoaRepository = IRepository<Pessoa>;
