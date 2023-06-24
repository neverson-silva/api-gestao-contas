import { Module } from '@nestjs/common';
import { contaProviders } from './conta.provider';
import { FormaPagamentoController } from './controllers/forma-pagamento.controller';
import { LancamentoController } from './controllers/lancamento.controller';
import { MesController } from './controllers/mes.controller';

@Module({
  imports: [],
  providers: contaProviders,
  exports: contaProviders,
  controllers: [LancamentoController, MesController, FormaPagamentoController],
})
export class ContaModule {}
