package com.dersaun.apigestaocontas.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaginationDTO {
    private Integer page = 1;
    private Integer linesPerPage = 10;
    private String orderBy = "id";
    private String direction = "DESC";
}
