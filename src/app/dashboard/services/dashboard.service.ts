import { MesAnoChartDTO } from '@app/conta/dtos/mes-ano-chart.dto';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import { IMesRepository } from '@app/conta/interfaces/mes.repository.interface';
import { IPessoaCorGraficoRepository } from '@app/conta/interfaces/pessoa-cor-grafico.repository.interface';
import { IResumoFaturaService } from '@app/conta/interfaces/resumo-fatura.service';
import { FormaPagamento } from '@app/conta/models/forma-pagamento.entity';
import { ResumoFatura } from '@app/conta/models/resumo-fatura.entity';
import { IDashboardService } from '@app/dashboard/interfaces/dashboard.service.interface';
import { DadosGraficoGastoPorFormaPagamentoDTO } from '@app/dashboard/dtos/dados-grafico-gasto-por-forma-pagamento.dto';
import { GastosFormaPagamentoMesAnoDTO } from '@app/dashboard/dtos/gastos-forma-pagamento-mes-ano.dto';
import { GastosPessoaMesAnoDTO } from '@app/dashboard/dtos/gastos-pessoa-mes-ano.dto';
import { TotalPessoaMesAnoDTO } from '@app/dashboard/dtos/total-pessoa-mes-ano.dto';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { Inject, Injectable } from '@nestjs/common';
import { mesUtil } from '@utils/meses';
import { numberUtils } from '@utils/number';

@Injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @Inject('IResumoFaturaService')
    private readonly resumoFaturaService: IResumoFaturaService,
    @Inject('IMesRepository')
    private readonly mesRepository: IMesRepository,
    @Inject('IPessoaCorGraficoRepository')
    private readonly pessoaCorGraficoRepository: IPessoaCorGraficoRepository,
  ) {}

  async criarGraficoFormaPagamento(
    mesAnoFinal: MesAnoDTO,
    numeroMeses: number,
    contarAtual: boolean,
    pessoa?: Pessoa,
  ): Promise<GastosFormaPagamentoMesAnoDTO[]> {
    const ultimosMeses = (
      await this.encontrarUltimosMeses(mesAnoFinal, numeroMeses, contarAtual)
    ).map((mesAno) => new GastosFormaPagamentoMesAnoDTO(mesAno));

    const resumosFatura =
      await this.resumoFaturaService.buscarResumoFaturasPorMesAnos(
        ultimosMeses,
        pessoa,
      );

    const resumosFormaPagamento: Map<FormaPagamento, ResumoFatura[]> =
      resumosFatura.groupBy((resumo) => resumo.formaPagamento);

    ultimosMeses.forEach((mesAno) => {
      const dadosGraficos: DadosGraficoGastoPorFormaPagamentoDTO[] = [];

      resumosFormaPagamento.forEach((_, formaPagamento) => {
        const resumosFormas = resumosFatura.filter((resumo) => {
          const localMesAno = mesAno.toMesAno();
          return (
            resumo.isInPeriod(localMesAno) &&
            resumo.formaPagamento.id === formaPagamento.id
          );
        });

        const total = numberUtils.somar(
          resumosFormas.map((resumo) => resumo.valorTotal),
        );

        const dadosGrafico = new DadosGraficoGastoPorFormaPagamentoDTO();
        dadosGrafico.valorTotal = total;
        dadosGrafico.corFormaPagamento = formaPagamento.cor;
        dadosGrafico.nomeFormaPagamento = formaPagamento.nome;

        dadosGraficos.push(dadosGrafico);
      });

      mesAno.totaisFormaPagamento = dadosGraficos;
    });

    return ultimosMeses;
  }

  async somarValoresCadaPessoaMesesAnteriores(
    mesAnoFinal: MesAnoDTO,
    numeroMeses: number,
    contarAtual: boolean,
    pessoa?: Pessoa,
  ): Promise<GastosPessoaMesAnoDTO[]> {
    const meses = (
      await this.encontrarUltimosMeses(mesAnoFinal, numeroMeses, contarAtual)
    ).map((gasto) => new GastosPessoaMesAnoDTO(gasto));

    const pessoaCores = await this.pessoaCorGraficoRepository.obterTudo();

    const resumosFatura =
      await this.resumoFaturaService.buscarResumoFaturasPorMesAnos(
        meses,
        pessoa,
      );
    const pessoas = resumosFatura.groupBy<Pessoa, ResumoFatura>(
      (resumo: ResumoFatura) => resumo.pessoa,
    );

    meses.forEach((mesAno) => {
      const lancs: TotalPessoaMesAnoDTO[] = [];

      const resumos = resumosFatura
        .filter((resumo) => resumo.isInPeriod(mesAno.toMesAno()))
        .sortBy((resumo: ResumoFatura) => resumo.pessoa.nome)
        .groupBy<Pessoa, ResumoFatura>((resumo: ResumoFatura) => resumo.pessoa);

      resumos.forEach((resumoPeriodo, pessoaKey) => {
        const totalPessoa = numberUtils.round(
          numberUtils.somar(resumoPeriodo.map((resumo) => resumo.valorTotal)),
        );

        const corGrafico = pessoaCores.find(
          (pc) => pc.pessoa.id === pessoaKey.id,
        );

        const totalPessoaMesAnoDto = new TotalPessoaMesAnoDTO(
          pessoaKey,
          totalPessoa,
        );
        totalPessoaMesAnoDto.corBackground = corGrafico.background;
        totalPessoaMesAnoDto.corBorder = corGrafico.border;

        lancs.push(totalPessoaMesAnoDto);
      });

      const pessoasForaPeriodo = Array.from(pessoas.keys()).filter(
        (p: Pessoa) => !lancs.some((item) => item.idPessoa === p.id),
      );

      if (pessoasForaPeriodo.length) {
        pessoasForaPeriodo.forEach((p) => {
          const corGrafico = pessoaCores.find((pc) => pc.pessoa.id === p.id);
          const totalPessoaMesAnoDto = new TotalPessoaMesAnoDTO(p, 0);
          totalPessoaMesAnoDto.corBackground = corGrafico.background;
          totalPessoaMesAnoDto.corBorder = corGrafico.border;
          lancs.push(totalPessoaMesAnoDto);
        });
      }

      mesAno.totaisPessoa = lancs.sortBy((item) => item.nome);
    });

    return meses;
  }

  private async encontrarUltimosMeses(
    mesAnoFinal: MesAnoDTO | null,
    numeroMeses: number,
    contarAtual: boolean,
  ): Promise<MesAnoChartDTO[]> {
    const mesesAnos: MesAnoChartDTO[] = [];
    const label: { current: MesAnoDTO } = {
      current: { mesReferencia: 0, anoReferencia: 0 },
    };

    if (mesAnoFinal === null) {
      mesAnoFinal = mesUtil.getMesAno(
        await this.mesRepository.findOneBy({ atual: true }),
      );
    }

    if (contarAtual) {
      label.current = mesAnoFinal;
    } else {
      label.current = mesUtil.getMesAnoAnterior(mesAnoFinal);
    }

    for (let numero = 0; numero < numeroMeses; numero++) {
      const localMesAno = label.current;
      const mesAnoChartDTO = new MesAnoChartDTO();
      mesAnoChartDTO.id = localMesAno.mesReferencia;
      mesAnoChartDTO.ano = localMesAno.anoReferencia;
      mesAnoChartDTO.nome = mesUtil.nome(localMesAno.mesReferencia);
      mesAnoChartDTO.fechamento = localMesAno.mesReferencia;
      mesAnoChartDTO.anoFechamento = localMesAno.anoReferencia;
      mesesAnos.push(mesAnoChartDTO);

      label.current = mesUtil.getMesAnoAnteriores(
        localMesAno.mesReferencia,
        localMesAno.anoReferencia,
      );
    }

    return mesesAnos.reverse();
  }
}
