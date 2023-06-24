import { ContaModule } from '@app/conta/conta.module';
import { Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboard.controller';
import { dashboardProviders } from './dashboard.provider';

@Module({
  imports: [ContaModule],
  controllers: [DashboardController],
  providers: dashboardProviders,
  exports: dashboardProviders,
})
export class DashboardModule {}
