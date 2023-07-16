import { AutenticacaoController } from '@app/autenticacao/controllers/autenticacao.controller';
import { UsuarioRepository } from '@app/autenticacao/repositories/usuario.reporitory';
import { AutenticacaoService } from '@app/autenticacao/services/autenticacao.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
