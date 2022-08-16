package com.dersaun.apigestaocontas.domain.services.impl;

import com.dersaun.apigestaocontas.api.request.UserCreateRequest;
import com.dersaun.apigestaocontas.domain.Pessoa;
import com.dersaun.apigestaocontas.domain.Usuario;
import com.dersaun.apigestaocontas.domain.services.UsuarioService;
import com.dersaun.apigestaocontas.infra.exception.HttpException;
import com.dersaun.apigestaocontas.infra.repository.RegraRepository;
import com.dersaun.apigestaocontas.infra.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RegraRepository regraRepository;

    @Override
    @Transactional
    public void salvar(UserCreateRequest user) {
        var userValidate = usuarioRepository.findByConta(user.getConta());

        if (userValidate.isPresent()) {
            throw HttpException.badRequest("Usuário já existe", "Usuário " + user.getConta() + " já cadastrado no sistema" );
        }

        var pessoa = new Pessoa();
        pessoa.setId(user.getPessoaId());

        var usuario = new Usuario();

        usuario.setConta(user.getConta());
        usuario.setSenha(user.getSenha());
        usuario.setPessoa(pessoa);
        usuario.setSituacao(1);
        usuario.setPrimeiroAcesso(true);

        var regra = regraRepository.findByAuthority("ROLE_USUARIO");

        usuario.setRegras(Collections.singletonList(regra));

        usuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> findByPessoa(Pessoa pessoa) {
        return usuarioRepository.findByPessoa(pessoa);
    }

}
