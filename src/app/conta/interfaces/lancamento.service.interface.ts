import { LancamentoDTO } from '@app/conta/dtos/lancamento.dto';
import { Lancamento } from '@app/conta/models/lancamento.entity';
import { UsuarioAutenticadoDto } from '@app/autenticacao/dtos/usuario-autenticado.dto';

export interface ILancamentoService {
  salvar(params: LancamentoDTO): Promise<Lancamento>;

  atualizar(
    idLancamento: number,
    lancamentoDTO: LancamentoDTO,
    usuario: UsuarioAutenticadoDto,
  ): Promise<void>;

  apagar(idLancamento: number): Promise<void>;
}
