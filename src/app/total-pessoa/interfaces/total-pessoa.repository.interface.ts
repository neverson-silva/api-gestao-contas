import { IRepository, ManagebleRepository } from '@infra/interfaces/repository';
import { TotalPessoa } from '../models/total-pessoa.entity';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';

export interface ITotalPessoaRepository
  extends IRepository<TotalPessoa>,
    ManagebleRepository {
  findAllByMesAno(mesAno: MesAnoDTO): Promise<TotalPessoa[]>;
}
