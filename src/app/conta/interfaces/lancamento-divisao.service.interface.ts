import { Lancamento } from '@app/conta/models/lancamento.entity';
import { DivisaoLancamentoDTO } from '@app/conta/dtos/lancamento.dto';
import { DivisaoDTO } from '@app/conta/dtos/divisao.dto';

export interface ILancamentoDivisaoService {
  dividirIgualmente(
    lancamento: Lancamento,
    divisaoLancamentoDTO: DivisaoLancamentoDTO,
  ): DivisaoDTO;

  dividirDiferente(
    lancamento: Lancamento,
    divisaoLancamentoDTO: DivisaoLancamentoDTO,
  ): DivisaoDTO;
}
