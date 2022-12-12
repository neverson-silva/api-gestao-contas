package com.dersaun.apigestaocontas.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eclipse.collections.api.list.MutableList;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DatasetDTO {

    private MutableList<? extends Number> data;

    private String color;
}