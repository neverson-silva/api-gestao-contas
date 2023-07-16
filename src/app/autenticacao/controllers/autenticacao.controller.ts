import { UsuarioDto } from '@app/autenticacao/dtos/usuario.dto';
import { IAutenticacaoService } from '@app/autenticacao/interfaces/autenticacao.service';
import { Public } from '@decorators/public.decorator';
import { Body, Controller, Inject, Post } from '@nestjs/common';

@Controller({ version: '1', path: 'auth' })
export class AutenticacaoController {
  constructor(
    @Inject('IAutenticacaoService')
    private readonly autenticacaoService: IAutenticacaoService,
  ) {}

  @Post('login')
  @Public()
  async login(@Body() user: UsuarioDto): Promise<any> {
    return await this.autenticacaoService.autenticar(user);
  }
}
