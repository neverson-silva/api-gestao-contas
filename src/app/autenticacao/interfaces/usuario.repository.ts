import { IRepository } from 'src/infra/interfaces/repository';
import { Usuario } from '../models/usuario.entity';

export type IUsuarioRepository = IRepository<Usuario>;
