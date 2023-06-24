import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AutenticacaoController } from './controllers/autenticacao.controller';
import { UsuarioRepository } from './repositories/usuario.reporitory';
import { AutenticacaoService } from './services/autenticacao.service';

@Module({
  imports: [],
  providers: [
    ConfigService,
    {
      provide: 'IUsuarioRepository',
      useClass: UsuarioRepository,
    },
    {
      provide: 'IAutenticacaoService',
      useClass: AutenticacaoService,
    },
  ],
  exports: [
    {
      provide: 'IAutenticacaoService',
      useClass: AutenticacaoService,
    },
  ],
  controllers: [AutenticacaoController],
})
export class AutenticacaoModule {}
