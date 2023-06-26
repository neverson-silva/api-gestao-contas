import { ManagebleRepository } from '@infra/interfaces/repository';
import { TotalPessoa } from '@app/total-pessoa/models/total-pessoa.entity';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';

export interface ITotalPessoaService extends ManagebleRepository {
  buscarTotaisPorMesAno(
    mesAnoDto: MesAnoDTO,
  ): TotalPessoa[] | Promise<TotalPessoa[]>;
  salvarPessoas(mesAno: MesAnoDTO): Promise<TotalPessoa[]>;
}
