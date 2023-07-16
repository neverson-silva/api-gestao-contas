import { FaturaAbertaRepository } from '@app/conta/repositories/fatura-aberta.repository';
import { FormaPagamentoRepository } from '@app/conta/repositories/forma-pagamento.repository';
import { LancamentoRepository } from '@app/conta/repositories/lancamento.repository';
import { MesRepository } from '@app/conta/repositories/mes.repository';
import { ParcelaRepository } from '@app/conta/repositories/parcela.repository';
import { PessoaCorGraficoRepository } from '@app/conta/repositories/pessoa-cor-grafico.repository';
import { ResumoFaturaRepository } from '@app/conta/repositories/resumo-fatura.repository';
import { FormaPagamentoService } from '@app/conta/services/forma-pagamento.service';
import { LancamentoDivisaoService } from '@app/conta/services/lancamento-divisao.service';
import { LancamentoService } from '@app/conta/services/lancamento.service';
import { MesService } from '@app/conta/services/mes.service';
import { ParcelaService } from '@app/conta/services/parcela.service';
import { ResumoFaturaService } from '@app/conta/services/resumo-fatura.service';
import { Provider } from '@nestjs/common';

export const contaProviders: Provider[] = [
  { provide: 'ILancamentoRepository', useClass: LancamentoRepository },
  { provide: 'IParcelaRepository', useClass: ParcelaRepository },
  { provide: 'IResumoFaturaRepository', useClass: ResumoFaturaRepository },
  {
    provide: 'ILancamentoService',
    useClass: LancamentoService,
  },
  {
    provide: 'IMesRepository',
    useClass: MesRepository,
  },
  { provide: 'IFormaPagamentoRepository', useClass: FormaPagamentoRepository },
  { provide: 'IFormaPagamentoService', useClass: FormaPagamentoService },
  { provide: 'IResumoFaturaService', useClass: ResumoFaturaService },
  {
    provide: 'IPessoaCorGraficoRepository',
    useClass: PessoaCorGraficoRepository,
  },
  {
    provide: 'IMesService',
    useClass: MesService,
  },
  {
    provide: 'ILancamentoDivisaoService',
    useClass: LancamentoDivisaoService,
  },
  {
    provide: 'IParcelaService',
    useClass: ParcelaService,
  },
  {
    provide: 'IFaturaAbertaRepository',
    useClass: FaturaAbertaRepository,
  },
];
