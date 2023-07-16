import { MesRepository } from '@app/conta/repositories/mes.repository';
import { ResumoFaturaRepository } from '@app/conta/repositories/resumo-fatura.repository';
import { PessoaService } from '@app/pessoa/services/pessoa.service';
import { Provider } from '@nestjs/common';

import { PessoaRepository } from '@app/pessoa/repositories/pessoa.repository';

export const pessoaProvider: Provider[] = [
  { provide: 'IPessoaRepository', useClass: PessoaRepository },
  { provide: 'IMesRepository', useClass: MesRepository },
  { provide: 'IResumoFaturaRepository', useClass: ResumoFaturaRepository },
  { provide: 'IPessoaService', useClass: PessoaService },
];
