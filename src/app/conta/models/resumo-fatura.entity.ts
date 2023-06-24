import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { isValidValue } from '@utils/index';
import { NumericTransformer } from '@infra/transformers/numeric.transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MesAnoDTO } from '../dtos/mes-ano.dto';
import { EFormaPagamento, FormaPagamento } from './forma-pagamento.entity';
import { Mes } from './mes.entity';

@Entity()
export class ResumoFatura {
  @PrimaryColumn({
    name: 'cartao_id',
    transformer: new NumericTransformer(),
  })
  formaPagamentoId: number;

  @PrimaryColumn({
    transformer: new NumericTransformer(),
  })
  pessoaId: number;

  @PrimaryColumn({
    transformer: new NumericTransformer(),
  })
  mesId: number;

  @PrimaryColumn({
    transformer: new NumericTransformer(),
  })
  ano: number;

  @Column({
    transformer: new NumericTransformer(),
  })
  valorTotal: number;

  @Column({
    transformer: new NumericTransformer(),
  })
  valorParcelado: number;

  @Column({
    name: 'valor_a_vista',
    transformer: new NumericTransformer(),
  })
  valorVista: number;

  @Column({
    transformer: new NumericTransformer(),
  })
  saldo: number;

  @ManyToOne(() => FormaPagamento, { eager: false })
  @JoinColumn({ name: 'cartao_id' })
  formaPagamento: FormaPagamento;

  @ManyToOne(() => Mes, { eager: false })
  @JoinColumn({ name: 'mes_id' })
  mes: Mes;

  @ManyToOne(() => Pessoa, { eager: false })
  @JoinColumn({ name: 'pessoa_id' })
  pessoa: Pessoa;

  constructor(obj?: Partial<ResumoFatura>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }

  isCarne(): boolean {
    return this.formaPagamento.id === EFormaPagamento.CARNE;
  }

  isDinheiro(): boolean {
    return this.formaPagamento.id === EFormaPagamento.DINHEIRO;
  }

  isParcelado(): boolean {
    return isValidValue(this.valorParcelado) && this.valorParcelado > 0;
  }

  isCartaoAVista(): boolean {
    return !this.isCarne() && !this.isDinheiro() && !this.isParcelado();
  }

  isInPeriod(mesAnoDTO: MesAnoDTO): boolean {
    if (mesAnoDTO == null) {
      return false;
    }
    return (
      this.mesId === mesAnoDTO.mesReferencia &&
      this.ano === mesAnoDTO.anoReferencia
    );
  }
}
