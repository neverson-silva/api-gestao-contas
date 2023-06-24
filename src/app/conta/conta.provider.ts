import { Provider } from '@nestjs/common';
import { FormaPagamentoRepository } from './repositories/forma-pagamento.repository';
import { LancamentoRepository } from './repositories/lancamento.repository';
import { MesRepository } from './repositories/mes.repository';
import { ParcelaRepository } from './repositories/parcela.repository';
import { PessoaCorGraficoRepository } from './repositories/pessoa-cor-grafico.repository';
import { ResumoFaturaRepository } from './repositories/resumo-fatura.repository';
import { LancamentoService } from './services/lancamento.service';
import { FormaPagamentoService } from './services/forma-pagamento.service';
import { ResumoFaturaService } from './services/resumo-fatura.service';
import { MesService } from '@app/conta/services/mes.service';
import { LancamentoDivisaoService } from '@app/conta/services/lancamento-divisao.service';
import { IParcelaService } from '@app/conta/interfaces/parcela.service.interface';
import { ParcelaService } from '@app/conta/services/parcela.service';
import { FaturaAbertaRepository } from '@app/conta/repositories/fatura-aberta.repository';

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
