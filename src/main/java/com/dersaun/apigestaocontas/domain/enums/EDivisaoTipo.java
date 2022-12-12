package com.dersaun.apigestaocontas.domain.enums;

public enum EDivisaoTipo {
    IGUALMENTE(1),
    DIFERENTE(2);
    private final int valor;
    EDivisaoTipo(int valor) {
        this.valor = valor;
    }

    public int getValor() {
        return valor;
    }
}
