import { Module } from '@nestjs/common';
import { totalPessoaProvider } from './total-pessoa.provider';
import { TotalPessoaController } from './controllers/total-pessoa.controller';

@Module({
  controllers: [TotalPessoaController],
  providers: totalPessoaProvider,
  exports: totalPessoaProvider,
})
export class TotalPessoaModule {}
