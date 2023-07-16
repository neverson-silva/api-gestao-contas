import { Usuario } from '@app/autenticacao/models/usuario.entity';
import { IRepository } from 'src/infra/interfaces/repository';

export type IUsuarioRepository = IRepository<Usuario>;
