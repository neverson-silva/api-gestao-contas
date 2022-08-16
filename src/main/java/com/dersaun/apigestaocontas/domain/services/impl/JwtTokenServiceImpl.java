package com.dersaun.apigestaocontas.domain.services.impl;

import com.dersaun.apigestaocontas.domain.dtos.UsuarioResponse;
import com.dersaun.apigestaocontas.domain.interfaces.UserCredentialDetails;
import com.dersaun.apigestaocontas.domain.services.JwtTokenService;
import com.dersaun.apigestaocontas.infra.security.AppUserDetails;
import com.dersaun.apigestaocontas.infra.security.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static com.dersaun.apigestaocontas.infra.security.Constantes.ACCESS_TOKEN_VALIDITY_SECONDS;

@Service
@SuppressWarnings("unchecked")
public class JwtTokenServiceImpl implements JwtTokenService {

    @Value("${app.signingKey}")
    private String signingKey;

    @Override
    public String generateToken(UserCredentialDetails usuario) {

        final UsuarioResponse usuarioResponse = new UsuarioResponse(usuario);
        return Jwts.builder()
                .setSubject(usuario.getConta())
                .claim("usuario", usuarioResponse)
                .signWith(SignatureAlgorithm.HS256, this.signingKey)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY_SECONDS*1000))
                .compact();
    }

    @Override
    public String generateToken(AppUserDetails userDetails) {
        UserCredentialDetails usuario = userDetails.getUsuario();
        try {
            return generateToken(usuario);
        }catch (Exception e ) {
            e.printStackTrace();
            throw new UsernameNotFoundException("Acesso negado");
        }
    }

    @Override
    public String getUsernameFromToken(String token) {
        try {
            return getClaimFromToken(token, Claims::getSubject);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public User getUsuario(String token) {
        Map<String, Object> userClaim = getUserFromToken(token);
        var user = new User();

        user.setId(((Integer) userClaim.get("id")).longValue());
        user.setConta((String) userClaim.get("conta"));
        user.setSenha((String) userClaim.get("senha"));
        user.setSituacao((Integer) userClaim.get("situacao"));
        user.setPessoa((Map) userClaim.get("pessoa"));
        user.setRoles((List<Map<String, String>>) userClaim.get("roles"));

        return user;
    }
    private  <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(signingKey)
                .parseClaimsJws(token)
                .getBody();
    }
    private Map<String, Object> getUserFromToken(String token) {
        final Claims claims = getAllClaimsFromToken(token);
        return (Map<String, Object>) claims.get("usuario");
    }


}
