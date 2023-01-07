package com.dersaun.apigestaocontas.infra.utils;

import com.dersaun.apigestaocontas.domain.Mes;
import com.dersaun.apigestaocontas.domain.dtos.MesAnoDTO;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

public class MesUtils {

    static Map<Integer, String> meses = new LinkedHashMap<>();

    static {
        meses.put(1, "Jan");
        meses.put(2, "Fev");
        meses.put(3, "Mar");
        meses.put(4, "Abr");
        meses.put(5, "Mai");
        meses.put(6, "Jun");
        meses.put(7, "Jul");
        meses.put(8, "Ago");
        meses.put(9, "Set");
        meses.put(10, "Out");
        meses.put(11, "Nov");
        meses.put(12, "Dez");
    }

    public static String nome(Long id) {
        return meses.get(id.intValue());
    }

    public static MesAnoDTO getMesAno(Mes mes) {
        return getMesAno(mes, LocalDate.now().getYear());
    }

    public static MesAnoDTO getMesAno(Mes mes, Integer ano) {
        var hoje = LocalDate.now();
        var mesAtual = hoje.getMonthValue();
        var paramMesId = mes.getId();

        if (mesAtual == 1 && mes.getId().intValue() == 12) {
            ano -= 1;
        }

        return new MesAnoDTO(paramMesId, ano, mes);
    }

    public static MesAnoDTO getMesAno(Long mes, Integer ano) {
        return getMesAno(new Mes(mes), ano);
    }

    public static MesAnoDTO getMesAno(Long mes) {
        return getMesAno(new Mes(mes), LocalDate.now().getYear());
    }


    public static MesAnoDTO getMesAnoReferencia(Mes mes) {
        return getMesAnoReferencia(mes, false);
    }

    public static MesAnoDTO getMesAnoReferencia(Mes mes, Boolean isParcelamento) {
        return getMesAnoReferencia(mes, LocalDate.now().getYear(), isParcelamento);
    }

    public static MesAnoDTO getMesAnoReferencia(Long mes, Integer ano) {
        return getMesAnoReferencia(mes, ano, false);
    }

    public static MesAnoDTO getMesAnoReferencia(Long mes, Integer ano, Boolean isParcelamento) {
        return getMesAnoReferencia(new Mes(mes), ano, isParcelamento);
    }

    public static MesAnoDTO getMesAnoReferencia(Long mes, Boolean isParcelamento) {
        return getMesAnoReferencia(new Mes(mes), LocalDate.now().getYear(), isParcelamento);
    }

    public static MesAnoDTO getMesAnoReferencia(Long mes) {
        return getMesAnoReferencia(mes, false);
    }

    public static MesAnoDTO getMesAnoReferencia(Mes mes, Integer ano) {
        return getMesAnoReferencia(mes, ano, false);
    }

    public static MesAnoDTO getMesAnoReferencia(Mes mes, Integer ano, Boolean isParcelamento) {
        var hoje = LocalDate.now();
        var mesReferencia = mes.getId().intValue();

        if (
                (mesReferencia == 12 &&
                        hoje.getMonthValue() != mesReferencia &&
                        ano < hoje.getYear()) ||
                        (mesReferencia == 12 &&
                                ano == hoje.getYear() &&
                                hoje.getMonthValue() == 1)
        ) {
            mesReferencia = 1;

            ano = isParcelamento
                    ? ano + 1
                    : ano < hoje.getYear()
                    ? ano + 1
                    : ano;
        } else if (mesReferencia == 12) {
            ano += 1;
            mesReferencia = 1;
        } else if (mesReferencia == 1 && ano < hoje.getYear()) {
            mesReferencia += 1;
            ano += 1;
        } else {
            mesReferencia += 1;
        }

        return new MesAnoDTO((long) mesReferencia, ano, mes);
    }

    public static MesAnoDTO getMesAnoAnterior(MesAnoDTO mesAno) {
        if (mesAno.getMes() == null) {
            mesAno.setMes(new Mes(mesAno.getMesReferencia()));
        }
        var mes = mesAno.getMesReferencia();
        var ano = mesAno.getAnoReferencia();
        var hoje = LocalDate.now();

        if (mesAno.getMes().getId().intValue() == 12 && hoje.getMonthValue() == 1) {
            mes = 11L;
            ano = hoje.getYear() - 1;
        } else if (mesAno.getMes().getId().intValue() == 1) {
            ano = hoje.getYear() - 1;
            mes = 12L;
        } else {
            mes -= 1L;
        }
        return new MesAnoDTO(mes, ano, null);
    }

    public static MesAnoDTO getMesAnoAnteriores(Long mes, Integer ano) {
        if (mes == 1L) {
            mes = 12L;
            ano -= 1;
        } else {
            mes -= 1L;
        }
        return new MesAnoDTO(mes, ano, null);
    }
}
