package com.dersaun.apigestaocontas.domain.services.impl;

import com.dersaun.apigestaocontas.domain.Usuario;
import com.dersaun.apigestaocontas.infra.repository.UsuarioRepository;
import com.dersaun.apigestaocontas.infra.security.AppUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        final Usuario usuario = usuarioRepository.findByConta(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        return new AppUserDetails(usuario);
    }
}