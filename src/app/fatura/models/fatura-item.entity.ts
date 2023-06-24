import { FormaPagamento } from '@app/conta/models/forma-pagamento.entity';
import { Lancamento } from '@app/conta/models/lancamento.entity';
import { Parcela } from '@app/conta/models/parcela.entity';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'fatura' })
export class FaturaItem implements Divisivel, Faturavel {
  @PrimaryColumn({ name: 'conta_id' })
  id: number;

  @Column()
  fechamento: number;

  @Column()
  ano: number;

  @ManyToOne(() => Parcela)
  @JoinColumn({ name: 'parcela_id' })
  parcela: Parcela;

  @ManyToOne(() => Lancamento)
  @JoinColumn({ name: 'conta_id' })
  lancamento: Lancamento;

  pessoaId: number;

  itensRelacionados: FaturaItem[] = [];

  @Expose()
  get divisaoId(): number {
    return this.lancamento?.divisaoId;
  }

  @Expose()
  get nome(): string {
    return this.lancamento.nome;
  }
  @Expose()
  get pessoa() {
    return this.lancamento.pessoa;
  }

  @Expose()
  get formaPagamento() {
    return this.lancamento.formaPagamento;
  }

  @Expose()
  get isPrincipal(): boolean {
    return this.lancamento.isPrincipal;
  }

  @Expose()
  get isDividido(): boolean {
    return this.lancamento.isDividido;
  }
  @Expose()
  get dividido(): boolean {
    return this.isDividido;
  }

  @Expose()
  get parcelado(): boolean {
    return this.isParcelado;
  }

  @Expose()
  get hasLancamentosDivididos(): boolean {
    return this.lancamento?.hasLancamentosDivididos;
  }

  @Expose()
  get isReadOnly(): boolean {
    return this.lancamento.isReadOnly;
  }

  @Expose()
  get isParcelado(): boolean {
    return this.lancamento.isParcelado;
  }

  @Exclude()
  get principal(): Divisivel {
    return this.lancamento.principal;
  }

  // @Exclude()
  get lancamentoRelacionado(): Lancamento {
    return this.lancamento.lancamentoRelacionado;
  }

  // @Exclude()
  @Expose()
  get valorUtilizado(): number {
    if (this.isParcelado) {
      return this.parcela.valorUtilizado;
    }
    return this.lancamento.valorUtilizado;
  }
}

export interface Faturavel {
  lancamento: Lancamento;

  pessoa: Pessoa;

  parcela: Parcela;

  formaPagamento: FormaPagamento;

  valorUtilizado: number;

  isParcelado: boolean;

  isDividido: boolean;

  isPrincipal: boolean;

  principal: Divisivel;
}

export interface Divisivel {
  isPrincipal: boolean;

  isDividido: boolean;

  principal: Divisivel;

  valorUtilizado: number;
}
