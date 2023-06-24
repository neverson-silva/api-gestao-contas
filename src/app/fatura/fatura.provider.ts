import { Provider } from '@nestjs/common';
import { FaturaItemRepository } from './repositories/fatura-item.repository';
import { FaturaService } from '@app/fatura/services/fatura.service';

export const faturaProviders: Provider[] = [
  { provide: 'IFaturaItemRepository', useClass: FaturaItemRepository },
  { provide: 'IFaturaService', useClass: FaturaService },
];
