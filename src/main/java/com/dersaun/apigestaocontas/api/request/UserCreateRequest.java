package com.dersaun.apigestaocontas.api.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateRequest implements Serializable {

    private Long pessoaId;

    private String conta;

    private String senha;
}
