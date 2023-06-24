import { Module } from '@nestjs/common';
import { totalPessoaProvider } from './total-pessoa.provider';

@Module({
  providers: totalPessoaProvider,
  exports: totalPessoaProvider,
})
export class TotalPessoaModule {}
