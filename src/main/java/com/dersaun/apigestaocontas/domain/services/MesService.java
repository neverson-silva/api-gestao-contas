package com.dersaun.apigestaocontas.domain.services;

import com.dersaun.apigestaocontas.domain.FormaPagamento;
import com.dersaun.apigestaocontas.domain.Mes;

import java.time.LocalDate;

public interface MesService {
    Mes getFromDataCompraAndFormaPagamento(LocalDate dataCompra, FormaPagamento formaPagamento) ;

    Mes getMesAtual();
}
