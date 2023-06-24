import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'pessoas_cores_graficos' })
export class PessoaCorGrafico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  border: string;

  @Column()
  background: string;

  @OneToOne((type) => Pessoa, { eager: false, cascade: true })
  @JoinColumn({ name: 'pessoa_id' })
  pessoa: Pessoa;
}
