import { contaProviders } from '@app/conta/conta.provider';
import { FormaPagamentoController } from '@app/conta/controllers/forma-pagamento.controller';
import { LancamentoController } from '@app/conta/controllers/lancamento.controller';
import { MesController } from '@app/conta/controllers/mes.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: contaProviders,
  exports: contaProviders,
  controllers: [LancamentoController, MesController, FormaPagamentoController],
})
export class ContaModule {}
