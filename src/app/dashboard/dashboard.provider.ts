import { DashboardService } from '@app/dashboard/services/dashboard.service';
import { Provider } from '@nestjs/common';

export const dashboardProviders: Provider[] = [
  { provide: 'IDashboardService', useClass: DashboardService },
];
