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
import { EAppProviders } from '@infra/enums/app-providers.enum';
import { PessoaRepository } from '@app/pessoa/repositories/pessoa.repository';

export const contaProviders: Provider[] = [
  {
    provide: EAppProviders.LANCAMENTO_REPOSITORY,
    useClass: LancamentoRepository,
  },
  { provide: EAppProviders.PARCELA_REPOSITORY, useClass: ParcelaRepository },
  {
    provide: EAppProviders.RESUMO_FATURA_REPOSITORY,
    useClass: ResumoFaturaRepository,
  },
  {
    provide: EAppProviders.LANCAMENTO_SERVICE,
    useClass: LancamentoService,
  },
  {
    provide: EAppProviders.MES_REPOSITORY,
    useClass: MesRepository,
  },
  {
    provide: EAppProviders.FORMA_PAGAMENTO_REPOSITORY,
    useClass: FormaPagamentoRepository,
  },
  {
    provide: EAppProviders.FORMA_PAGAMENTO_SERVICE,
    useClass: FormaPagamentoService,
  },
  {
    provide: EAppProviders.RESUMO_FATURA_SERVICE,
    useClass: ResumoFaturaService,
  },
  {
    provide: EAppProviders.PESSOA_COR_GRAFICO_REPOSITORY,
    useClass: PessoaCorGraficoRepository,
  },
  {
    provide: EAppProviders.MES_SERVICE,
    useClass: MesService,
  },
  {
    provide: EAppProviders.LANCAMENTO_DIVISAO_SERVICE,
    useClass: LancamentoDivisaoService,
  },
  {
    provide: EAppProviders.PARCELA_SERVICE,
    useClass: ParcelaService,
  },
  {
    provide: EAppProviders.FATURA_ABERTA_REPOSITORY,
    useClass: FaturaAbertaRepository,
  },
  {
    provide: EAppProviders.PESSOA_REPOSITORY,
    useClass: PessoaRepository,
  },
];
