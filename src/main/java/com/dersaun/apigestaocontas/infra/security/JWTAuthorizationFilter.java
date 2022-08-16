package com.dersaun.apigestaocontas.infra.security;

import com.dersaun.apigestaocontas.domain.services.JwtTokenService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.dersaun.apigestaocontas.infra.security.Constantes.HEADER_STRING;
import static com.dersaun.apigestaocontas.infra.security.Constantes.TOKEN_PREFIX;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter {

    private final JwtTokenService tokenService;

    public JWTAuthorizationFilter(AuthenticationManager authManager,
                                  JwtTokenService tokenService) {

        super(authManager);
        this.tokenService = tokenService;
    }

    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws IOException, ServletException {
        String header = req.getHeader(HEADER_STRING);
        if (header == null || !header.startsWith(TOKEN_PREFIX)) {
            chain.doFilter(req, res);
            return;
        }
        UsernamePasswordAuthenticationToken authentication = getAuthentication(header.replace(TOKEN_PREFIX, ""));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        chain.doFilter(req, res);
    }

    private UsernamePasswordAuthenticationToken getAuthentication(String token) {

        User usuario = tokenService.getUsuario(token);

        if (usuario != null) {
            var regras = usuario.getRoles();
            return new UsernamePasswordAuthenticationToken(new AppUserDetails(usuario), null, regras);
        }
        return null;
    }

}