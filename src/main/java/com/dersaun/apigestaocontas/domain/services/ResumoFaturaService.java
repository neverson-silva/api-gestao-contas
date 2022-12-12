package com.dersaun.apigestaocontas.domain.services;

import com.dersaun.apigestaocontas.domain.Pessoa;
import com.dersaun.apigestaocontas.domain.ResumoFatura;
import com.dersaun.apigestaocontas.domain.dtos.MesAnoChartDTO;
import com.dersaun.apigestaocontas.domain.dtos.MesAnoDTO;
import com.dersaun.apigestaocontas.domain.dtos.ResumoFaturaPessoas;
import com.dersaun.apigestaocontas.domain.dtos.ResumoFormaPagamentoMensalResponseDTO;
import org.eclipse.collections.api.list.MutableList;

import java.util.List;

public interface ResumoFaturaService {

    public final long DINHEIRO = 7L;
    public final long CARNE = 6L;

    ResumoFormaPagamentoMensalResponseDTO buscarResumoPagamentos(MesAnoDTO mesAnoDTO, Long idPessoa);

    ResumoFormaPagamentoMensalResponseDTO buscarResumoPagamentosMesAtual(Long idPessoa);

    List<ResumoFaturaPessoas> resumoFaturaPessoas(MesAnoDTO mesAnoDTO);

    MutableList<ResumoFatura> buscarResumoFaturasPorMesAnos(MutableList<? extends MesAnoChartDTO> meses, Pessoa pessoa);
}
