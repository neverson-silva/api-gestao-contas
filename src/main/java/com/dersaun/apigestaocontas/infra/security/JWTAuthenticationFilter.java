package com.dersaun.apigestaocontas.infra.security;

import com.dersaun.apigestaocontas.domain.dtos.UserCredentials;
import com.dersaun.apigestaocontas.domain.services.JwtTokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

import static com.dersaun.apigestaocontas.infra.security.Constantes.HEADER_STRING;
import static com.dersaun.apigestaocontas.infra.security.Constantes.TOKEN_PREFIX;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;

    private final JwtTokenService tokenService;

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager,
                                   JwtTokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req,
                                                HttpServletResponse res) throws AuthenticationException {
        try {
            UserCredentials creds = new ObjectMapper()
                    .readValue(req.getInputStream(), UserCredentials.class);
            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            creds.getConta(),
                            creds.getSenha(),
                            new ArrayList<>())
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest req,
                                            HttpServletResponse res,
                                            FilterChain chain,
                                            Authentication auth) throws IOException, ServletException {
        UserDetails userDetails = (AppUserDetails) auth.getPrincipal();

        String token = tokenService.generateToken((AppUserDetails) userDetails);

        res.addHeader(HEADER_STRING, TOKEN_PREFIX + token);
    }
}
