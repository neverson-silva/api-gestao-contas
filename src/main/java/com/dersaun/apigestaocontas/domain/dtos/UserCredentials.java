package com.dersaun.apigestaocontas.domain.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserCredentials implements Serializable {

    private static final long serialVersionUID = 1L;

    @Email
    @NotNull
    private String conta;

    @NotNull
    private String senha;
}