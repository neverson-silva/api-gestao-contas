package com.dersaun.apigestaocontas.api.controllers;

import com.dersaun.apigestaocontas.domain.dtos.GastosFormaPagamentoMesAnoDTO;
import com.dersaun.apigestaocontas.domain.dtos.MesAnoDTO;
import com.dersaun.apigestaocontas.domain.dtos.ResumoFaturaPessoas;
import com.dersaun.apigestaocontas.domain.dtos.ResumoFormaPagamentoMensalResponseDTO;
import com.dersaun.apigestaocontas.domain.services.DashboardService;
import com.dersaun.apigestaocontas.domain.services.ResumoFaturaService;
import org.eclipse.collections.api.list.MutableList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("dashboard")
public class DashboardController {

    @Autowired
    private ResumoFaturaService resumoFaturaService;

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("resumo-pagamentos/{pessoaId}")
    public ResponseEntity<ResumoFormaPagamentoMensalResponseDTO> resumoPagamentos(
            @PathVariable("pessoaId") Long pessoaId,
            MesAnoDTO mesAnoDTO
    ) {
        var resumos = resumoFaturaService.buscarResumoPagamentos(mesAnoDTO, pessoaId);

        return ResponseEntity.ok(resumos);
    }

    @GetMapping("resumo-fatura-pessoas")
    public ResponseEntity<List<ResumoFaturaPessoas>> resumoFaturaPessoas(MesAnoDTO mesAnoDTO) {
        var resumos = resumoFaturaService.resumoFaturaPessoas(mesAnoDTO);
        return ResponseEntity.ok(resumos);
    }

    @GetMapping("grafico/gastos-por-pessoa")
    public ResponseEntity<?> graficoGastosPorPessoa(MesAnoDTO mesAnoDTO) {
        var resultado = this.dashboardService.somarValoresCadaPessoaMesesAnteriores(
                mesAnoDTO, 8, true
        );
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("grafico/gastos-por-cartao")
    public ResponseEntity<MutableList<GastosFormaPagamentoMesAnoDTO>> dadosGraficoGastorPorFormaPagamento(MesAnoDTO mesAnoDTO) {
        var resultado = this.dashboardService.criarGraficoFormaPagamento(
                mesAnoDTO, 4, true
        );
        return ResponseEntity.ok(resultado);
    }
}
