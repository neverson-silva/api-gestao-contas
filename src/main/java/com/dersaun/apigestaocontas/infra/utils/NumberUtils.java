package com.dersaun.apigestaocontas.infra.utils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collection;

public class NumberUtils {

    public static BigDecimal somar(Collection<? extends Number> numbers) {
        var valor = numbers.stream()
                .map(v -> v instanceof BigDecimal ? ((BigDecimal) v).doubleValue() : (double) v)
                .reduce(0D, Double::sum);
        return roundValue(valor);
    }


    public static BigDecimal roundValue(double valor) {
        return roundValue(valor, RoundingMode.HALF_UP);
    }

    public static BigDecimal roundValue(double valor, RoundingMode roundingMode) {
        BigDecimal bd = BigDecimal.valueOf(valor);
        bd = bd.setScale(2, roundingMode);
        return bd;
    }

    public static BigDecimal roundValue(BigDecimal valor) {
        var bd = valor.setScale(2, RoundingMode.HALF_UP);
        return bd;
    }

    public static double toDoubleValue(Object valor) {
        if (valor instanceof Integer) {
            return Double.valueOf((Integer) valor);
        } else if (valor instanceof String) {
            return Double.parseDouble((String) valor);
        }
        return (Double) valor;
    }
}
