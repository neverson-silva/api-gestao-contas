import { ManagebleRepository } from '@infra/interfaces/repository';
import { TotalPessoa } from '@app/total-pessoa/models/total-pessoa.entity';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import { DeepPartial } from 'typeorm';

export interface ITotalPessoaService extends ManagebleRepository {
  buscarTotaisPorMesAno(mesAnoDto: MesAnoDTO): Promise<TotalPessoa[]>;

  salvarPessoas(mesAno: MesAnoDTO): Promise<TotalPessoa[]>;

  atualizarValorPago(
    id: number,
    totalPessoa: DeepPartial<TotalPessoa>,
  ): Promise<TotalPessoa>;
}
