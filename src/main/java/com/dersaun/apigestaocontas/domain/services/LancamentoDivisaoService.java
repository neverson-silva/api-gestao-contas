package com.dersaun.apigestaocontas.domain.services;

import com.dersaun.apigestaocontas.api.request.DivisaoLancamentoDTO;
import com.dersaun.apigestaocontas.domain.Lancamento;
import com.dersaun.apigestaocontas.domain.dtos.DivisaoDTO;

public interface LancamentoDivisaoService {

    DivisaoDTO dividirIgualmente(Lancamento lancamento, DivisaoLancamentoDTO divisaoLancamentoDTO);

    DivisaoDTO dividirDiferente(Lancamento lancamento, DivisaoLancamentoDTO divisaoLancamentoDTO);
}
