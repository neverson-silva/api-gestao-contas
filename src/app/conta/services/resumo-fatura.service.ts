import { UsuarioAutenticadoDto } from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { MesAnoChartDTO } from '@app/conta/dtos/mes-ano-chart.dto';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import { ResumoFaturaPessoas } from '@app/conta/dtos/resumo-faturas';
import { ResumoFormaPagamentoMensalResponseDTO } from '@app/conta/dtos/resumo-forma-pagamento-mensal-response.dto';
import { ResumoFormaPagamentoMensalDTO } from '@app/conta/dtos/resumo-forma-pagamento-mensal.dto';
import { IMesRepository } from '@app/conta/interfaces/mes.repository.interface';
import { IResumoFaturaRepository } from '@app/conta/interfaces/resumo-fatura.repository.interface';
import { IResumoFaturaService } from '@app/conta/interfaces/resumo-fatura.service';
import { ResumoFatura } from '@app/conta/models/resumo-fatura.entity';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { Inject, Injectable } from '@nestjs/common';
import { mesUtil } from '@utils/meses';
import { numberUtils } from '@utils/number';

@Injectable()
export class ResumoFaturaService implements IResumoFaturaService {
  constructor(
    @Inject('IResumoFaturaRepository')
    private readonly resumoFaturaRepository: IResumoFaturaRepository,
    @Inject('IMesRepository') private readonly mesRepository: IMesRepository,
  ) {}

  async buscarResumoPagamentos(
    mesAnoDTO: MesAnoDTO,
    idPessoa: number,
  ): Promise<ResumoFormaPagamentoMensalResponseDTO> {
    const mesAnoAnterior = mesUtil.getMesAnoAnterior(mesAnoDTO);

    const resumos =
      await this.resumoFaturaRepository.findAllByPessoaIdAndMesAndAno(
        idPessoa,
        mesAnoDTO.mesReferencia,
        mesAnoDTO.anoReferencia,
      );

    const resumosAnteriores =
      await this.resumoFaturaRepository.findAllByPessoaIdAndMesAndAno(
        idPessoa,
        mesAnoAnterior.mesReferencia,
        mesAnoAnterior.anoReferencia,
      );

    const resumosPagamentos = new ResumoFormaPagamentoMensalResponseDTO();

    const cartaoAvistaAtual = this.getResumosCartaoAvista(resumos);
    const dinheiroAtual = this.getResumosDinheiro(resumos);
    const parceladoAtual = this.getResumosParcelados(resumos);

    const valorCartaoAvista = numberUtils.somar(cartaoAvistaAtual);
    const valorDinheiro = numberUtils.somar(dinheiroAtual);
    const valorParcelado = numberUtils.somar(parceladoAtual);

    const valorTotal = numberUtils.somar(
      resumos.map((resumo) => resumo.valorTotal),
    );

    const valorCartaoAnterior = numberUtils.somar(
      this.getResumosCartaoAvista(resumosAnteriores),
    );

    const valorDinheiroAnterior = numberUtils.somar(
      this.getResumosDinheiro(resumosAnteriores),
    );

    const valorParceladoAnterior = numberUtils.somar(
      this.getResumosParcelados(resumosAnteriores),
    );

    const valorTotalAnterior = numberUtils.somar(
      resumosAnteriores.map((resumo) => resumo.valorTotal),
    );

    const diferencaCartao = this.calcularPorcentagemDiferenca(
      valorCartaoAnterior,
      valorCartaoAvista,
    );
    const diferencaDinheiro = this.calcularPorcentagemDiferenca(
      valorDinheiroAnterior,
      valorDinheiro,
    );
    const diferencaParcelado = this.calcularPorcentagemDiferenca(
      valorParceladoAnterior,
      valorParcelado,
    );
    const diferencaTotal = this.calcularPorcentagemDiferenca(
      valorTotalAnterior,
      valorTotal,
    );

    resumosPagamentos.cartao = new ResumoFormaPagamentoMensalDTO({
      porcentagem: diferencaCartao,
      valor: valorCartaoAvista,
      corIcone: 'green',
      titulo: 'Cartão à vista',
    });

    resumosPagamentos.dinheiro = new ResumoFormaPagamentoMensalDTO({
      porcentagem: diferencaDinheiro,
      valor: valorDinheiro,
      corIcone: 'green',
      titulo: 'Dinheiro',
    });

    resumosPagamentos.parcelado = new ResumoFormaPagamentoMensalDTO({
      porcentagem: diferencaParcelado,
      valor: valorParcelado,
      corIcone: 'violet',
      titulo: 'Parcelado',
    });

    resumosPagamentos.total = new ResumoFormaPagamentoMensalDTO({
      porcentagem: diferencaTotal,
      valor: valorTotal,
      corIcone: 'cyan',
      titulo: 'Total',
    });

    return resumosPagamentos;
  }

  async buscarResumoPagamentosMesAtual(
    idPessoa: number,
  ): Promise<ResumoFormaPagamentoMensalResponseDTO> {
    const mesAnoDto = mesUtil.getMesAno(
      await this.mesRepository.findOneBy({ atual: true }),
    );
    return await this.buscarResumoPagamentos(mesAnoDto, idPessoa);
  }

  async resumoFaturaPessoas(
    mesAnoDTO: MesAnoDTO,
    usuario: UsuarioAutenticadoDto,
  ): Promise<ResumoFaturaPessoas[]> {
    const mesAnoAnterior = mesUtil.getMesAnoAnterior(mesAnoDTO);
    const usuarioAdmin = usuario.isAdmin();

    let resumosFaturaMesAtual: ResumoFatura[];

    if (usuarioAdmin) {
      resumosFaturaMesAtual =
        await this.resumoFaturaRepository.findAllBydMesAndAno(
          mesAnoDTO.mesReferencia,
          mesAnoDTO.anoReferencia,
        );
    } else {
      const idPessoa = usuario.ifNotAdminGetPessoa()?.id;
      resumosFaturaMesAtual =
        await this.resumoFaturaRepository.findByMesAndAnoAndPessoas(
          mesAnoDTO.mesReferencia,
          mesAnoDTO.anoReferencia,
          [idPessoa ?? 0],
        );
    }

    const resumosFaturaPorPessoa: Map<Pessoa, ResumoFatura[]> =
      resumosFaturaMesAtual.groupBy<Pessoa, ResumoFatura>(
        (rf: ResumoFatura) => rf.pessoa,
      );

    const resumosMesAnteriorPorPessoa =
      await this.resumoFaturaRepository.findByMesAndAnoAndPessoas(
        mesAnoAnterior.mesReferencia,
        mesAnoAnterior.anoReferencia,
        Array.from(resumosFaturaPorPessoa.keys()).map((pessoa) => pessoa.id),
      );

    const resumosFaturaPessoaMesAnterior: Map<Pessoa, ResumoFatura[]> =
      resumosMesAnteriorPorPessoa.groupBy<Pessoa, ResumoFatura>(
        (rf: ResumoFatura) => rf.pessoa,
      );

    const resumosResponseList: ResumoFaturaPessoas[] = [];

    resumosFaturaPorPessoa.forEach((resumosFatura, pessoa) => {
      const valorMesAtual = resumosFatura
        .map((rf) => rf.valorTotal)
        .reduce(
          (acumulador, valorAtual) =>
            numberUtils.round(acumulador + valorAtual),
          0,
        );

      let valorMesAnterior = 0;

      if (resumosFaturaPessoaMesAnterior.contains(pessoa)) {
        valorMesAnterior = resumosFaturaPessoaMesAnterior
          .take(pessoa)
          .map((rf) => rf.valorTotal)
          .reduce(
            (acumulador, valorAtual) =>
              numberUtils.round(acumulador + valorAtual),
            0,
          );
      }

      const resumoFaturaPessoa = new ResumoFaturaPessoas();
      resumoFaturaPessoa.pessoa = pessoa;
      resumoFaturaPessoa.resumos = [...resumosFatura].sort((a, b) =>
        a.formaPagamento.nome.localeCompare(b.formaPagamento.nome),
      );
      resumoFaturaPessoa.valorMesAtual = valorMesAtual;
      resumoFaturaPessoa.valorMesAnterior = valorMesAnterior;

      resumosResponseList.push(resumoFaturaPessoa);
    });

    const response = resumosResponseList.sortBy('pessoa.nome');
    return response;
  }

  async buscarResumoFaturasPorMesAnos(
    meses: MesAnoChartDTO[],
    pessoa: Pessoa,
  ): Promise<ResumoFatura[]> {
    return await this.resumoFaturaRepository.buscarResumoFaturasPorMesAnos(
      meses,
      pessoa,
    );
  }

  private getResumosCartaoAvista(resumosFaturas: ResumoFatura[]): number[] {
    return resumosFaturas
      .filter((resumo) => resumo.isCartaoAVista())
      .map((resumo) => resumo.valorVista);
  }

  private getResumosDinheiro(resumosFaturas: ResumoFatura[]): number[] {
    return resumosFaturas
      .filter((resumoFatura) => resumoFatura.formaPagamento.isDinheiro())
      .map((resumoFatura) => resumoFatura.valorVista);
  }

  private getResumosParcelados(resumosFaturas: ResumoFatura[]): number[] {
    return resumosFaturas
      .filter((resumo) => resumo.isParcelado())
      .map((resumoFatura) => resumoFatura.valorParcelado);
  }

  private calcularPorcentagemDiferenca(
    valorAnterior: number,
    valorAtual: number,
  ): number {
    try {
      if (valorAnterior === 0 && valorAtual === 0) {
        return 0;
      }

      if (valorAnterior === 0 || valorAtual === 0) {
        return valorAnterior > valorAtual ? -100 : 100;
      }

      const percentual = (valorAtual / valorAnterior - 1) * 100;

      return numberUtils.round(percentual);
    } catch (e) {
      throw new Error(e);
    }
  }
}
