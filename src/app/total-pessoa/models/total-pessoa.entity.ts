import { Mes } from '@app/conta/models/mes.entity';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { NumericTransformer } from '@infra/transformers/numeric.transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TotalPessoa {
  @PrimaryGeneratedColumn({ name: 'total_pessoa_id' })
  id: number;

  @ManyToOne(() => Pessoa, { eager: false })
  @JoinColumn({ name: 'devedor_id' })
  pessoa: Pessoa;

  @ManyToOne(() => Mes, { eager: false })
  @JoinColumn({ name: 'mes' })
  mes: Mes;

  @Column({
    transformer: new NumericTransformer(),
  })
  ano: number;

  @Column({
    name: 'total_mes',
    transformer: new NumericTransformer(),
    type: 'decimal',
  })
  total: number;

  @Column({
    transformer: new NumericTransformer(),
    type: 'decimal',
  })
  valorPago: number;

  @Column({
    transformer: new NumericTransformer(),
  })
  diferenca: number;
}
