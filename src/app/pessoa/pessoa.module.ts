import { PessoaController } from '@app/pessoa/controllers/pessoa.controller';
import { pessoaProvider } from '@app/pessoa/pessoa.provider';
import { StorageModule } from '@app/storage/storage.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, StorageModule],
  providers: pessoaProvider,
  exports: pessoaProvider,
  controllers: [PessoaController],
})
export class PessoaModule {}
