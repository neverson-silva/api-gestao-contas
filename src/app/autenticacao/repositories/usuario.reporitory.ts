import { IUsuarioRepository } from '@app/autenticacao/interfaces/usuario.repository';
import { Usuario } from '@app/autenticacao/models/usuario.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UsuarioRepository
  extends Repository<Usuario>
  implements IUsuarioRepository
{
  constructor(em: EntityManager) {
    super(Usuario, em);
  }
}
