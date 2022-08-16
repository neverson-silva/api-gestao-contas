package com.dersaun.apigestaocontas.infra.exception;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class ControllerExceptionHandler {

    @Autowired
    private Logger logger;

    @ExceptionHandler(HttpException.class)
    public ResponseEntity<?> standardError(HttpException e, HttpServletRequest request) {

        e.setPath(request.getRequestURI());

        Map<String, Object> error = prepareErrorMap(e);

        return ResponseEntity.status( e.getStatus() ).body(error);
    }

    private Map<String, Object> prepareErrorMap(HttpException ex) {
        Map<String, Object>  error = new HashMap<>();

        error.put("time", ex.getFormattedDate() );
        error.put("statusCode", ex.getStatusCode());
        error.put("error", ex.getError() );
        error.put("message", ex.getMessage() );
        error.put("path", ex.getPath() );

        return error;
    }
}
