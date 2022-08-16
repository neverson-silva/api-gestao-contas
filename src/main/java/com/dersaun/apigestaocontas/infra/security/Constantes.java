package com.dersaun.apigestaocontas.infra.security;

public interface Constantes {
    long ACCESS_TOKEN_VALIDITY_SECONDS = 12 * 60 * 60;
    long ACCESS_REFRESH_TOKEN_VALIDITY_SECONDS = 48 * 60 * 60;
    String TOKEN_PREFIX = "Bearer ";
    String HEADER_STRING = "Authorization";
    String AUTHORITIES_KEY = "scopes";

}
