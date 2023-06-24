import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PessoaController } from './controllers/pessoa.controller';
import { pessoaProvider } from './pessoa.provider';
import { StorageModule } from '@app/storage/storage.module';

@Module({
  imports: [ConfigModule, StorageModule],
  providers: pessoaProvider,
  exports: pessoaProvider,
  controllers: [PessoaController],
})
export class PessoaModule {}
