import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import * as bcrypt from 'bcryptjs';
import { Regra } from './regra.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password' })
  @Exclude()
  senha: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  primeiroAcesso: boolean;

  @Column()
  situacao: number;

  @OneToOne(() => Pessoa, { eager: false, cascade: true })
  @JoinColumn({ name: 'devedor_id' })
  pessoa: Pessoa;

  @ManyToMany(() => Regra, { eager: false, cascade: true })
  @JoinTable({
    name: 'usuario_regra',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'regra_id', referencedColumnName: 'id' },
  })
  regras: Regra[];

  /**
   * Encriptar senha BCRYPT compativel com php e java(hibernate)
   * @param senha
   */
  async criptografarSenha(senha: string) {
    const hash = (await bcrypt.hash(senha, 10)) as string;
    this.senha = hash.replace('$2b$', '$2y$');
  }

  /**
   * Comparar senha BCRYPT compativel com php e java(hibernate)
   * @param senha
   */
  async compararSenha(senha: string) {
    return await bcrypt.compare(senha, this.senha?.replace('$2y$', '$2b$'));
  }

  isAdmin(): boolean {
    return this.isGranted('ROLE_ADMIN');
  }

  isNotAdmin(): boolean {
    return !this.isAdmin();
  }

  isGranted(role: string) {
    const regras = this?.regras.map((r) => r.authority);
    return regras.includes(role);
  }

  isNotGranted(role: string) {
    return !this.isGranted(role);
  }
}
