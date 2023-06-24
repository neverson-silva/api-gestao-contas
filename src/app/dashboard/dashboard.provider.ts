import { Provider } from '@nestjs/common';
import { DashboardService } from './services/dashboard.service';

export const dashboardProviders: Provider[] = [
  { provide: 'IDashboardService', useClass: DashboardService },
];
