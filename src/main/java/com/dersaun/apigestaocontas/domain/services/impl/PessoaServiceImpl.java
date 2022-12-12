package com.dersaun.apigestaocontas.domain.services.impl;

import com.dersaun.apigestaocontas.domain.Pessoa;
import com.dersaun.apigestaocontas.domain.services.PessoaService;
import com.dersaun.apigestaocontas.infra.repository.PessoaRepository;
import org.eclipse.collections.api.list.MutableList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PessoaServiceImpl implements PessoaService {

    @Autowired
    private PessoaRepository pessoaRepository;

    @Override
    public MutableList<Pessoa> getPessoas() {
        return pessoaRepository.findAllByOrderByNomeAsc();
    }
}
