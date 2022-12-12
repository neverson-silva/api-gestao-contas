package com.dersaun.apigestaocontas.domain.services;

import com.dersaun.apigestaocontas.domain.Pessoa;
import org.eclipse.collections.api.list.MutableList;

public interface PessoaService {
    MutableList<Pessoa> getPessoas();
}
