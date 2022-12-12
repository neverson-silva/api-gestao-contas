package com.dersaun.apigestaocontas.domain.services;

import com.dersaun.apigestaocontas.domain.dtos.PaginationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface PaginationService<T> {

    Page<T> paginate(List<T> itens, Pageable pageable);

    /**
     * Creates a pageable to be used in pagination
     *
     */
    static Pageable createPageable(PaginationDTO paginationDTO) {

        var page = paginationDTO.getPage();

        page = page > 0 ? page - 1 : page;

        return PageRequest.of(page,
                paginationDTO.getLinesPerPage(),
                Sort.Direction.valueOf(paginationDTO.getDirection()),
                paginationDTO.getOrderBy());
    }
}