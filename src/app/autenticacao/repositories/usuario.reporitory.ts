import { EntityManager, Repository } from 'typeorm';
import { Usuario } from '../models/usuario.entity';
import { Injectable } from '@nestjs/common';
import { IUsuarioRepository } from '../interfaces/usuario.repository';

@Injectable()
export class UsuarioRepository
  extends Repository<Usuario>
  implements IUsuarioRepository
{
  constructor(em: EntityManager) {
    super(Usuario, em);
  }
}
