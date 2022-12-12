package com.dersaun.apigestaocontas.api.request;

import com.dersaun.apigestaocontas.domain.dtos.MesAnoDTO;
import com.dersaun.apigestaocontas.domain.dtos.PaginationDTO;
import com.dersaun.apigestaocontas.infra.utils.MesUtils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BuscarLancamentosFaturaRequestDTO extends PaginationDTO {
    private Long idPessoa;
    private Long mes;
    private Integer ano;

    private Boolean somenteAtivos = false;

    private String searchKey;

    public MesAnoDTO getMesAno() {
        return MesUtils.getMesAnoReferencia(mes, ano);
    }
}
