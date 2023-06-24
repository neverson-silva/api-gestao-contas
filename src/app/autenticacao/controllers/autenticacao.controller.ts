import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Public } from '@decorators/public.decorator';
import { UsuarioDto } from '../dtos/usuario.dto';
import { IAutenticacaoService } from '../interfaces/autenticacao.service';

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
