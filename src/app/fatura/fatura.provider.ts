import { FaturaItemRepository } from '@app/fatura/repositories/fatura-item.repository';
import { FaturaService } from '@app/fatura/services/fatura.service';
import { Provider } from '@nestjs/common';

export const faturaProviders: Provider[] = [
  { provide: 'IFaturaItemRepository', useClass: FaturaItemRepository },
  { provide: 'IFaturaService', useClass: FaturaService },
];
