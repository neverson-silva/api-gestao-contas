package com.dersaun.apigestaocontas.infra.exception;

public class TokenRefreshException extends HttpException{

    public TokenRefreshException(String refreshToken, String message) {
        super("Falha [" + refreshToken + "]: " + message, "Acesso não autorizado" ,403);
    }
}
