import { ITotalPessoaRepository } from '@app/total-pessoa/interfaces/total-pessoa.repository.interface';
import { ITotalPessoaService } from '@app/total-pessoa/interfaces/total-pessoa.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import { TotalPessoa } from '@app/total-pessoa/models/total-pessoa.entity';
import { IResumoFaturaRepository } from '@app/conta/interfaces/resumo-fatura.repository.interface';
import { FechamentoFaturaException } from '@app/conta/fechamento-fatura.exception';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { ResumoFatura } from '@app/conta/models/resumo-fatura.entity';

@Injectable()
export class TotalPessoaService implements ITotalPessoaService {
  constructor(
    @Inject('ITotalPessoaRepository')
    private readonly totalPessoaRepository: ITotalPessoaRepository,
    @Inject('IResumoFaturaRepository')
    private readonly resumoFaturaRepository: IResumoFaturaRepository,
  ) {}

  async salvarPessoas(mesAno: MesAnoDTO): Promise<TotalPessoa[]> {
    const resumosFatura = await this.resumoFaturaRepository.findAllBydMesAndAno(
      mesAno.mesReferencia,
      mesAno.anoReferencia,
    );

    const resumosPorPessoa = resumosFatura.groupBy<Pessoa, ResumoFatura>(
      (r) => r.pessoa,
    );

    const pessoas = [];

    resumosPorPessoa.forEach((resumos, pessoa) => {
      const totalMes = resumos
        .map((r) => r.valorTotal)
        .reduce((a, b) => a + b, 0);

      let valorPago = 0;

      if (pessoa.id == 8) {
        valorPago = resumos
          .filter((r) => r.formaPagamento.id == 7)
          .map((r) => r.valorTotal)
          .reduce((a, b) => a + b, 0);
      }

      const diferenca = valorPago ? totalMes - valorPago : totalMes;

      const totalPessoa = new TotalPessoa();
      totalPessoa.pessoa = pessoa;
      totalPessoa.mes = mesAno.mes;
      totalPessoa.ano = mesAno.anoReferencia;
      totalPessoa.total = totalMes.toFloat();
      totalPessoa.valorPago = valorPago.toFloat();
      totalPessoa.diferenca = -diferenca.toFloat();

      pessoas.push(totalPessoa);
    });

    try {
      return await this.totalPessoaRepository.save(pessoas);
    } catch (e) {
      throw new FechamentoFaturaException(
        `Erro ao salvar total pessoas: ${e.message}`,
      );
    }
  }

  getEntityManager(): EntityManager {
    return this.totalPessoaRepository.getEntityManager();
  }

  restoreCurrentManager() {
    this.totalPessoaRepository.restoreCurrentManager();
  }

  setEntityManager(em: EntityManager): EntityManager {
    return this.totalPessoaRepository.setEntityManager(em);
  }

  storeCurrentManager() {
    this.totalPessoaRepository.storeCurrentManager();
  }
}
