import { Module } from '@nestjs/common';
import { faturaProviders } from './fatura.provider';
import { FaturaController } from './controllers/fatura.controller';
import { ContaModule } from '@app/conta/conta.module';
import { TotalPessoaModule } from '@app/total-pessoa/total-pessoa.module';

@Module({
  imports: [ContaModule, TotalPessoaModule],
  providers: faturaProviders,
  exports: faturaProviders,
  controllers: [FaturaController],
})
export class FaturaModule {}
