package com.dersaun.apigestaocontas.domain.services.impl;

import com.dersaun.apigestaocontas.domain.services.PaginationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PaginationServiceImpl<T> implements PaginationService<T> {

    private T type;

    @Override
    public Page<T> paginate(List<T> itens, Pageable pageable) {
        var start = (pageable.getPageNumber() )* pageable.getPageSize();

        var end = start + pageable.getPageSize();

        var totalRecords = itens.size();

        if (end > totalRecords) {
            end = totalRecords;
        }

        List<T> novos = end > totalRecords ? new ArrayList() : itens.subList(start, end);

        Page<T> pages = new PageImpl<>(novos, pageable, totalRecords);

        return pages;
    }
}