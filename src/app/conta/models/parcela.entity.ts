import { Lancamento } from '@app/conta/models/lancamento.entity';
import { Mes } from '@app/conta/models/mes.entity';
import { NumericTransformer } from '@infra/transformers/numeric.transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'parcelas' })
export class Parcela {
  @PrimaryGeneratedColumn({ name: 'parcela_id' })
  id: number;

  @Column({ transformer: new NumericTransformer() })
  vencimento: number;

  @Column({ name: 'nr_parcela', transformer: new NumericTransformer() })
  numero: number;

  @Column({
    name: 'valor_parcela',
    type: 'decimal',
    precision: 8,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  valor: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  valorPago: number;

  @ManyToOne(() => Lancamento, { eager: false })
  @JoinColumn({ name: 'conta_id' })
  lancamento: Lancamento;

  @Column('boolean')
  pago: boolean;

  @Column('boolean', { name: 'parcela_atual' })
  atual: boolean;

  @ManyToOne(() => Mes, { eager: false })
  @JoinColumn({ name: 'mes_id' })
  mes: Mes;

  @Column({ transformer: new NumericTransformer() })
  ano: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(obj?: Partial<Parcela>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }

  get valorUtilizado() {
    if (this.pago) {
      return this.valorPago;
    }
    return this.valor;
  }
}
