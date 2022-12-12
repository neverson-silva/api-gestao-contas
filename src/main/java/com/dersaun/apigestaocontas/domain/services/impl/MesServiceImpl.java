package com.dersaun.apigestaocontas.domain.services.impl;

import com.dersaun.apigestaocontas.domain.FormaPagamento;
import com.dersaun.apigestaocontas.domain.Mes;
import com.dersaun.apigestaocontas.domain.services.MesService;
import com.dersaun.apigestaocontas.infra.repository.MesRepository;
import com.dersaun.apigestaocontas.infra.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;

import static com.dersaun.apigestaocontas.domain.services.ResumoFaturaService.CARNE;
import static com.dersaun.apigestaocontas.domain.services.ResumoFaturaService.DINHEIRO;
@Service
public class MesServiceImpl implements MesService {

    @Autowired
    private MesRepository mesRepository;


    @Override
    public Mes getFromDataCompraAndFormaPagamento(LocalDate dataCompra, FormaPagamento formaPagamento) {
        var mesAtual = this.mesRepository.buscarMesAtual();
        var hoje = LocalDate.now();
        var mesCompra = dataCompra.getMonthValue();

        var ultimoDiaMesDataCompra = DateUtils.getLastDayOfMonth(dataCompra);
        if (Arrays.asList(DINHEIRO, CARNE).contains(formaPagamento.getId())) {
            return new Mes((long) mesCompra);
        }
        if (formaPagamento.getNome().toLowerCase().contains("nubank") && mesAtual.getId().intValue() + 1 == mesCompra && hoje.getDayOfMonth() <= 3) {
            return mesAtual;
        } else if (dataCompra.getDayOfMonth() <= 3 && formaPagamento.getNome().toLowerCase().contains("nubank")) {
            var newMes = dataCompra.minusMonths(1);
            return new Mes((long) newMes.getMonthValue());
        } else if (ultimoDiaMesDataCompra == dataCompra.getDayOfMonth() && !formaPagamento.getNome().toLowerCase().contains("nubank")) {
            var newMes = dataCompra.plusMonths(1);
            return new Mes((long) newMes.getMonthValue());
        } else if (mesAtual.getId().intValue() == mesCompra) {
            return mesAtual;
        }
        return new Mes((long) mesCompra);
    }

    @Override
    public Mes getMesAtual() {
        return this.mesRepository.buscarMesAtual();
    }
}
