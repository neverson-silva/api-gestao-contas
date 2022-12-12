package com.dersaun.apigestaocontas.domain.services.impl;

import com.dersaun.apigestaocontas.domain.FormaPagamento;
import com.dersaun.apigestaocontas.domain.Pessoa;
import com.dersaun.apigestaocontas.domain.ResumoFatura;
import com.dersaun.apigestaocontas.domain.dtos.*;
import com.dersaun.apigestaocontas.domain.services.DashboardService;
import com.dersaun.apigestaocontas.domain.services.ResumoFaturaService;
import com.dersaun.apigestaocontas.domain.services.UsuarioService;
import com.dersaun.apigestaocontas.infra.repository.MesRepository;
import com.dersaun.apigestaocontas.infra.repository.PessoaCorGraficoRepository;
import com.dersaun.apigestaocontas.infra.utils.MesUtils;
import com.dersaun.apigestaocontas.infra.utils.NumberUtils;
import org.eclipse.collections.api.RichIterable;
import org.eclipse.collections.api.list.MutableList;
import org.eclipse.collections.api.map.MutableMap;
import org.eclipse.collections.impl.list.mutable.FastList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Nullable;
import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.IntStream;

@Service
public class DashboardImpl implements DashboardService {

    @Autowired
    private MesRepository mesRepository;

//    @Autowired
//    private PessoaService pessoaService;

    @Autowired
    private ResumoFaturaService resumoFaturaService;

    @Autowired
    private PessoaCorGraficoRepository pessoaCorGraficoRepositorio;

    @Override
    public MutableList<GastosFormaPagamentoMesAnoDTO> criarGraficoFormaPagamento(MesAnoDTO mesAnoFinal,
                                                                                 Integer numeroMeses,
                                                                                 Boolean contarAtual) {
        var ultimosMeses = encontrarUltimosMeses(
                mesAnoFinal,
                numeroMeses,
                contarAtual
        ).collect(GastosFormaPagamentoMesAnoDTO::new);

        var pessoa = UsuarioService.ifNotAdminGetPessoa();
        var resumosFatura = resumoFaturaService.buscarResumoFaturasPorMesAnos(ultimosMeses, pessoa);

        MutableMap<FormaPagamento, RichIterable<ResumoFatura>> resumosFormaPagamento = resumosFatura.groupBy(ResumoFatura::getFormaPagamento).toMap();


        ultimosMeses.each(mesAno -> {

            var dadosGraficos = new FastList<DadosGraficoGastoPorFormaPagamentoDTO>();

            resumosFormaPagamento.forEach((formaPagamento, resumos) -> {
                var resumosFormas = resumosFatura.select(resumo -> resumo.isInPeriod(mesAno.toMesAno()) && resumo.getFormaPagamento().equals(formaPagamento)).toList();

                var total = NumberUtils.somar(resumosFormas.collect(ResumoFatura::getValorTotal));

                var dadosGrafico = new DadosGraficoGastoPorFormaPagamentoDTO();

                dadosGrafico.setValorTotal(total);
                dadosGrafico.setCorFormaPagamento(formaPagamento.getCor());
                dadosGrafico.setNomeFormaPagamento(formaPagamento.getNome());
                dadosGraficos.add(dadosGrafico);

            });

            mesAno.setTotaisFormaPagamento(dadosGraficos);
        });


        return ultimosMeses;
    }

    @Override
    public MutableList<GastosPessoaMesAnoDTO> somarValoresCadaPessoaMesesAnteriores(MesAnoDTO mesAnoFinal,
                                                                                    Integer numeroMeses,
                                                                                    Boolean contarAtual) {
        var meses = encontrarUltimosMeses(
                mesAnoFinal,
                numeroMeses,
                contarAtual
        ).collect(GastosPessoaMesAnoDTO::new);

        var pessoaCores = pessoaCorGraficoRepositorio.obterTudo();


        var pessoa = UsuarioService.ifNotAdminGetPessoa();
        var resumosFatura = resumoFaturaService.buscarResumoFaturasPorMesAnos(meses, pessoa);
        MutableMap<Pessoa, RichIterable<ResumoFatura>> pessoas = resumosFatura.groupBy(ResumoFatura::getPessoa).toMap();

        meses.each(mesAno -> {
            MutableList<TotalPessoaMesAnoDTO> lancs = new FastList<>();

            var resumos = resumosFatura
                    .select(resumo -> resumo.isInPeriod(mesAno.toMesAno()))
                    .sortThisBy(resumo -> resumo.getPessoa().getNome())
                    .groupBy(ResumoFatura::getPessoa)
                    .toMap();

            resumos.forEach((pessoaKey, resumoPeriodo) -> {

                var totalPessoa = NumberUtils.roundValue(
                        resumoPeriodo.sumOfDouble(r -> r.getValorTotal().doubleValue())
                );
                var corGrafico = pessoaCores.stream().filter(pc -> pc.getPessoa().getId().equals(pessoaKey.getId())).toList().get(0);

                var totalPessoaMesAnoDto = new TotalPessoaMesAnoDTO(pessoaKey, totalPessoa);
                totalPessoaMesAnoDto.setCorBackgroud(corGrafico.getBackground());
                totalPessoaMesAnoDto.setCorBorder(corGrafico.getBorder());

                lancs.add(totalPessoaMesAnoDto);
            });


            var pessoasForaPeriodo = pessoas
                    .keysView()
                    .select(p -> !lancs.containsBy(TotalPessoaMesAnoDTO::getIdPessoa, p.getId()))
                    .toList();

            if (pessoasForaPeriodo.notEmpty()) {
                pessoasForaPeriodo.forEach(p -> {
                    var corGrafico = pessoaCores.stream().filter(pc -> pc.getPessoa().getId().equals(p.getId())).toList().get(0);
                    var totalPessoaMesAnoDto = new TotalPessoaMesAnoDTO(p, BigDecimal.valueOf(0));
                    totalPessoaMesAnoDto.setCorBackgroud(corGrafico.getBackground());
                    totalPessoaMesAnoDto.setCorBorder(corGrafico.getBorder());
                    lancs.add(totalPessoaMesAnoDto);
                });
            }

            mesAno.setTotaisPessoa(lancs.sortThisBy(TotalPessoaMesAnoDTO::getNome));

        });

        return meses;
    }

    private MutableList<MesAnoChartDTO> encontrarUltimosMeses(@Nullable MesAnoDTO mesAnoFinal,
                                                              Integer numeroMeses,
                                                              Boolean contarAtual) {

        var mesesAnos = new FastList<MesAnoChartDTO>();

        var label = new AtomicReference<MesAnoDTO>();

        if (mesAnoFinal == null) {
            mesAnoFinal = MesUtils.getMesAno(mesRepository.buscarMesAtual());
        }

        if (contarAtual) {
            label.set(mesAnoFinal);
        } else {
            label.set(MesUtils.getMesAnoAnterior(mesAnoFinal));
        }


        IntStream.range(0, numeroMeses).forEach(numero -> {
            var localMesAno = label.get();

            MesAnoChartDTO mesAnoChartDTO = new MesAnoChartDTO();
            mesAnoChartDTO.setId(localMesAno.getMesReferencia());
            mesAnoChartDTO.setAno(localMesAno.getAnoReferencia());
            mesAnoChartDTO.setNome(MesUtils.nome(localMesAno.getMesReferencia()));
            mesAnoChartDTO.setFechamento(localMesAno.getMesReferencia());
            mesAnoChartDTO.setAnoFechamento(localMesAno.getAnoReferencia());

            mesesAnos.add(mesAnoChartDTO);

            label.set(
                    MesUtils.getMesAnoAnteriores(localMesAno.getMesReferencia(), localMesAno.getAnoReferencia())
            );

        });
        return mesesAnos.reverseThis();
    }

}
