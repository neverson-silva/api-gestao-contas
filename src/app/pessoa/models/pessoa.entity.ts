import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Expose } from 'class-transformer';

@Entity({ name: 'devedores' })
export class Pessoa {
  @PrimaryColumn({ name: 'devedor_id' })
  id: number;

  @Column()
  @Length(1, 50)
  @IsNotEmpty()
  @IsString()
  nome: string;

  @Column()
  @Length(1, 50)
  @IsNotEmpty()
  @IsString()
  sobrenome: string;

  @Column()
  @Length(0, 50)
  @IsString()
  apelido: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(0, 1)
  sexo: string;

  @Column()
  dataNascimento: Date;

  @Column({ name: 'profile' })
  fotoPerfil: string;

  @Expose()
  get nomeCompleto() {
    return `${this.nome} ${this.sobrenome}`;
  }

  constructor(id: number = null) {
    if (id) {
      this.id = id;
    }
  }

  @Expose()
  get perfil() {
    const foto = this.fotoPerfil;

    if (foto) {
      return foto;
    }
    return null;
  }
}
