import { ContaModule } from '@app/conta/conta.module';
import { FaturaController } from '@app/fatura/controllers/fatura.controller';
import { faturaProviders } from '@app/fatura/fatura.provider';
import { TotalPessoaModule } from '@app/total-pessoa/total-pessoa.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ContaModule, TotalPessoaModule],
  providers: faturaProviders,
  exports: faturaProviders,
  controllers: [FaturaController],
})
export class FaturaModule {}
