import { ContaModule } from '@app/conta/conta.module';
import { DashboardController } from '@app/dashboard/controllers/dashboard.controller';
import { dashboardProviders } from '@app/dashboard/dashboard.provider';
import { Module } from '@nestjs/common';

@Module({
  imports: [ContaModule],
  controllers: [DashboardController],
  providers: dashboardProviders,
  exports: dashboardProviders,
})
export class DashboardModule {}
