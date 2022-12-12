package com.dersaun.apigestaocontas.infra.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

@Data
@Getter
@Setter
@EqualsAndHashCode(callSuper=true)
public class HttpException extends RuntimeException{

    private Long timestamp;
    private HttpStatus status;
    private String error;
    private String message;
    private Boolean show = true;
    private String path;

    public HttpException(Long timestamp, Integer statusCode, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = HttpStatus.resolve(statusCode);
        this.error = error;
        this.message = message;
        this.path = path;
    }

    public HttpException(String message, Long timestamp, Integer statusCode, String error,  String path) {
        super(message);
        this.timestamp = timestamp;
        this.status =  HttpStatus.resolve(statusCode);
        this.error = error;
        this.message = message;
        this.path = path;
    }

    public HttpException(String message, Throwable cause, Long timestamp, Integer statusCode, String error, String path) {
        super(message, cause);
        this.timestamp = timestamp;
        this.status = HttpStatus.resolve(statusCode);
        this.error = error;
        this.message = message;
        this.path = path;
    }

    public HttpException(String message, String error, Integer statusCode) {
        super(message);
        this.error = error;
        this.message = message;
        this.timestamp = System.currentTimeMillis();
        setStatus(statusCode);
    }

    public HttpException(String message, String error, Integer statusCode, Boolean show) {
        super(message);
        this.error = error;
        this.message = message;
        this.timestamp = System.currentTimeMillis();
        this.show = show;
        setStatus(statusCode);
    }


    public void setStatus(Integer code) {
        this.status = HttpStatus.resolve(code);
    }

    public Integer getStatusCode() {
        return status.value();
    }

    public String getFormattedDate() {
        Timestamp ts=new Timestamp(System.currentTimeMillis());
        Date date=new Date(ts.getTime());
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy hh:mm:ss");

        return sdf.format(date);
    }

    public static HttpException notFound(String message) {
        return new HttpException(message, "Recurso não encontrado", 404);
    }

    public static HttpException notFound(String error, String message) {
        return new HttpException(message, error, 404);
    }

    public static HttpException badRequest(String message) {
        return new HttpException(message, "Bad Request", 400);
    }

    public static HttpException badRequest(String error, String message) {
        return new HttpException(message, error, 400);
    }

    public static HttpException badRequest(String error, String message, Boolean show) {
        return new HttpException(message, error, 400, show);
    }

    public static HttpException internalError(String message) {
        return new HttpException(message, "Erro inesperado", 500);
    }

    public static HttpException internalError(String message, Boolean show) {
        return new HttpException(message, "Erro inesperado", 500, show);
    }

    public static HttpException forbidden(String message) {
        return new HttpException(message, "Acesso negado", 403);
    }

    public static HttpException unauthorized(String message) {
        return new HttpException(message, "Usuário não autenticado", 401);
    }

    public static HttpException unprocessableEntity(String message) {
        return new HttpException(message, "Unprocessable Entity", 422);
    }

    public static HttpException unprocessableEntity(String message, Boolean show) {
        return new HttpException(message, "Unprocessable Entity", 422, show);
    }
}
