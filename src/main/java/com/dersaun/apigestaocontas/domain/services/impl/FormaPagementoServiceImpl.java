package com.dersaun.apigestaocontas.domain.services.impl;

import com.dersaun.apigestaocontas.domain.FormaPagamento;
import com.dersaun.apigestaocontas.domain.dtos.MesAnoDTO;
import com.dersaun.apigestaocontas.domain.services.FormaPagamentoService;
import com.dersaun.apigestaocontas.domain.services.UsuarioService;
import com.dersaun.apigestaocontas.infra.exception.HttpException;
import com.dersaun.apigestaocontas.infra.repository.FormaPagamentoRepository;
import com.dersaun.apigestaocontas.infra.utils.MesUtils;
import org.eclipse.collections.api.list.MutableList;
import org.eclipse.collections.impl.list.mutable.FastList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FormaPagementoServiceImpl implements FormaPagamentoService {

    @Autowired
    private FormaPagamentoRepository formaPagamentoRepository;

    @Override
    public MutableList<FormaPagamento> buscarFormasPagamentosAtivasAdmin() {
        return formaPagamentoRepository.findAllByAtivoIsTrueOrderByNomeAsc();
    }

    @Override
    public MutableList<FormaPagamento> buscarFormasPagamentosDono(Long idPessoa) {
        return formaPagamentoRepository.findAllByDonoIdAndAtivoIsTrueOrderByNomeAsc(idPessoa);
    }

    @Override
    public FormaPagamento buscarPorId(Long id) {
        return formaPagamentoRepository.findById(id).orElseThrow(() -> HttpException.notFound("Forma de pagamento não cadastrada") );
    }

    @Override
    public MutableList<FormaPagamento> buscarFormasPagamentosComCompras(MesAnoDTO mesAnoDTO) {
        var pessoa = UsuarioService.ifNotAdminGetPessoa();
        var mesAnoReferencia = MesUtils.getMesAnoReferencia(mesAnoDTO.getMesReferencia(), mesAnoDTO.getAnoReferencia());

        var formasPagamentos = formaPagamentoRepository.buscarFormasPagamentosComCompras(
                mesAnoReferencia.getMesReferencia(),
                mesAnoReferencia.getAnoReferencia(),
                pessoa
        );
        return FastList.newList(formasPagamentos);
    }
}
