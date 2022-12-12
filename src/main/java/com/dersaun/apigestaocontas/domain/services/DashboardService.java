package com.dersaun.apigestaocontas.domain.services;

import com.dersaun.apigestaocontas.domain.dtos.GastosFormaPagamentoMesAnoDTO;
import com.dersaun.apigestaocontas.domain.dtos.GastosPessoaMesAnoDTO;
import com.dersaun.apigestaocontas.domain.dtos.MesAnoDTO;
import org.eclipse.collections.api.list.MutableList;

public interface DashboardService {

    MutableList<GastosFormaPagamentoMesAnoDTO> criarGraficoFormaPagamento(MesAnoDTO mesAnoFinal, Integer numeroMeses, Boolean contarAtual);

    MutableList<GastosPessoaMesAnoDTO> somarValoresCadaPessoaMesesAnteriores(MesAnoDTO mesAnoFinal, Integer numeroMeses, Boolean contarAtual);
}
