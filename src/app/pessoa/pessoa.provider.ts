import { MesRepository } from '@app/conta/repositories/mes.repository';
import { ResumoFaturaRepository } from '@app/conta/repositories/resumo-fatura.repository';
import { Provider } from '@nestjs/common';
import { PessoaRepository } from './repositories/pessoa.repository';
import { IPessoaService } from '@app/pessoa/interfaces/pessoa.service.interface';
import { PessoaService } from '@app/pessoa/services/pessoa.service';

export const pessoaProvider: Provider[] = [
  { provide: 'IPessoaRepository', useClass: PessoaRepository },
  { provide: 'IMesRepository', useClass: MesRepository },
  { provide: 'IResumoFaturaRepository', useClass: ResumoFaturaRepository },
  { provide: 'IPessoaService', useClass: PessoaService },
];
