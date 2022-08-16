package com.dersaun.apigestaocontas.domain.services;

import com.dersaun.apigestaocontas.domain.RefreshToken;

import java.util.Optional;

public interface RefreshTokenService {

    Optional<RefreshToken> findByToken(String token) ;

    RefreshToken createRefreshToken(Long userId);

    RefreshToken getRefreshToken(Long userId);

    RefreshToken refresh(RefreshToken refreshToken);

    RefreshToken verifyExpiration(RefreshToken token);

    int deleteByUserId(Long userId);
}
