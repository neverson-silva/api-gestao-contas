import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cartoes' })
export class FormaPagamento {
  @PrimaryGeneratedColumn({ name: 'cartao_id' })
  id: number;

  @Column()
  nome: string;

  @ManyToOne(() => Pessoa, { cascade: ['update'], eager: false })
  @JoinColumn({ name: 'devedor_id' })
  dono: Pessoa;

  @Column()
  ativo: boolean;

  @Column({ name: 'vencimento' })
  diaVencimento: number;

  @Column()
  cor: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataCriacao: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  dataAlteracao: Date;

  constructor(id?: number) {
    this.id = id;
  }

  isCartao(): boolean {
    return this.id !== 6 && this.id !== 7;
  }

  isDinheiro(): boolean {
    return this.id === 7;
  }
}

export enum EFormaPagamento {
  CARNE = 6,
  DINHEIRO = 7,
}
