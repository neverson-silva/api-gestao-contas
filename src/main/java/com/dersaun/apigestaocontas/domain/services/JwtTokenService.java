package com.dersaun.apigestaocontas.domain.services;

import com.dersaun.apigestaocontas.domain.interfaces.UserCredentialDetails;
import com.dersaun.apigestaocontas.infra.security.AppUserDetails;
import com.dersaun.apigestaocontas.infra.security.User;

public interface JwtTokenService {

    String generateToken(UserCredentialDetails usuario);
    String generateToken(AppUserDetails userDetails);

    String getUsernameFromToken(String token);

    User getUsuario(String token);

}
