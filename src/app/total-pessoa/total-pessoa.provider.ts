import { Provider } from '@nestjs/common';
import { TotalPessoaRepository } from './repositories/total-pessoa.repository';
import { TotalPessoaService } from './services/total-pessoa/total-pessoa.service';
import { ResumoFaturaRepository } from '@app/conta/repositories/resumo-fatura.repository';

export const totalPessoaProvider: Provider[] = [
  { provide: 'ITotalPessoaRepository', useClass: TotalPessoaRepository },
  { provide: 'ITotalPessoaService', useClass: TotalPessoaService },
  { provide: 'IResumoFaturaRepository', useClass: ResumoFaturaRepository },
];
