package com.dersaun.apigestaocontas.api.controllers;

import com.dersaun.apigestaocontas.domain.RefreshToken;
import com.dersaun.apigestaocontas.domain.dtos.UserCredentials;
import com.dersaun.apigestaocontas.domain.dtos.UsuarioResponse;
import com.dersaun.apigestaocontas.domain.services.JwtTokenService;
import com.dersaun.apigestaocontas.domain.services.RefreshTokenService;
import com.dersaun.apigestaocontas.domain.services.UsuarioService;
import com.dersaun.apigestaocontas.infra.security.AppUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RequestMapping("/auth")
@RestController
public class AuthController {

    @Autowired
    private JwtTokenService tokenService;

    @Autowired()
    private AuthenticationManager authenticationManager;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserCredentials credentials) {

        Authentication authentication  = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(credentials.getConta(), credentials.getSenha()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        AppUserDetails userDetails = (AppUserDetails) authentication.getPrincipal();

        String token = tokenService.generateToken(userDetails);

        RefreshToken refreshToken = refreshTokenService.getRefreshToken(userDetails.getUsuario().getId());

        UsuarioResponse usuarioResponse = new UsuarioResponse(userDetails.getUsuario(), token, refreshToken.getToken() );

        return ResponseEntity.ok(usuarioResponse);

    }
}
