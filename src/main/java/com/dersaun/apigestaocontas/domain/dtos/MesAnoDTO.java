package com.dersaun.apigestaocontas.domain.dtos;


import com.dersaun.apigestaocontas.domain.Mes;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
public class MesAnoDTO {
    @NonNull
    Long mesReferencia;

    @NonNull
    Integer anoReferencia;

    Mes mes;
}
