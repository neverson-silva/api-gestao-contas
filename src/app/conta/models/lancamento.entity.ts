import { FormaPagamento } from '@app/conta/models/forma-pagamento.entity';
import { Mes } from '@app/conta/models/mes.entity';
import { Parcela } from '@app/conta/models/parcela.entity';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { NumericTransformer } from '@infra/transformers/numeric.transformer';
import { isValidValue } from '@utils/index';
import { numberUtils } from '@utils/number';
import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Tree,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contas', { orderBy: { dataCompra: 'DESC' } })
@Tree('adjacency-list')
export class Lancamento {
  @PrimaryGeneratedColumn({ name: 'conta_id' })
  id: number;

  @Column({ name: 'compra_nome', length: 50 })
  nome: string;

  @Column({ length: 150 })
  descricao: string;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  valor: number;

  @Column({ name: 'data_compra' })
  dataCompra: Date;

  @Column()
  ano: number;

  @Column()
  parcelado: boolean;

  @Column({ name: 'qtd_parcelas' })
  quantidadeParcelas: number;

  @ManyToOne(() => Pessoa)
  @JoinColumn({ name: 'devedor_id' })
  pessoa: Pessoa;

  @ManyToOne(() => FormaPagamento)
  @JoinColumn({ name: 'cartao_id' })
  formaPagamento: Relation<FormaPagamento>;

  @ManyToOne(() => Mes)
  @JoinColumn({ name: 'mes_id' })
  mes: Mes;

  @Column()
  pago: boolean;

  @Column({ name: 'tipo_conta' })
  tipoConta: number;

  @Column({ name: 'divisao_id' })
  divisaoId: number;

  @ManyToOne(() => Lancamento, {
    cascade: false,
  })
  @JoinColumn({ name: 'conta_id_relacionado' })
  lancamentoRelacionado: Lancamento;

  @OneToMany(
    () => Lancamento,
    (lancamento) => lancamento.lancamentoRelacionado,
    {
      cascade: true,
    },
  )
  @Exclude()
  lancamentos: Lancamento[];

  @OneToMany(() => Parcela, (parcela) => parcela.lancamento, { cascade: true })
  @Exclude()
  parcelas: Parcela[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'valor_dividido', type: 'decimal', precision: 8, scale: 2 })
  valorDividido: number;

  @Expose()
  get isPrincipal(): boolean {
    return this.divisaoId !== null && this.lancamentoRelacionado === null;
  }

  @Expose()
  get isDividido(): boolean {
    const temDivisao = isValidValue(this.divisaoId);
    const temLancamentos = isValidValue(this.lancamentos);
    return temDivisao || temLancamentos;
  }

  @Expose()
  get isPago(): boolean {
    return this.pago !== null && this.pago;
  }

  @Expose()
  get isParcelado(): boolean {
    return this.parcelado !== null && this.parcelado;
  }

  @Expose()
  get isReadOnly(): boolean {
    return (
      (this.isDividido && !this.isPrincipal) ||
      (this.formaPagamento.dono !== null &&
        this.formaPagamento.dono?.id !== this.pessoa.id &&
        ![1, 2].includes(this.formaPagamento.id))
    );
  }

  @Exclude()
  get principal(): Lancamento {
    if (this.divisaoId !== null && this.lancamentoRelacionado !== null) {
      return this.lancamentoRelacionado;
    }
    return null;
  }

  get valorUtilizado(): number {
    const isDividido = this.isDividido;
    if (isDividido) {
      return this.valorDividido;
    }
    return this.valor;
  }

  @Exclude()
  get hasLancamentosDivididos(): boolean {
    return (
      isValidValue(this.lancamentos) || isValidValue(this.lancamentoRelacionado)
    );
  }

  @Expose()
  get valorPorParcela(): number {
    return this.isParcelado
      ? numberUtils.round(Number(this.valorUtilizado) / this.quantidadeParcelas)
      : 0;
  }
}
