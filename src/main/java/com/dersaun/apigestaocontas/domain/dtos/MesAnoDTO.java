package com.dersaun.apigestaocontas.domain.dtos;


import com.dersaun.apigestaocontas.domain.Mes;
import lombok.*;

import javax.annotation.Nullable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
public class MesAnoDTO {
    @NonNull
    Long mesReferencia;

    @NonNull
    Integer anoReferencia;

    @Nullable
    Mes mes;
}
