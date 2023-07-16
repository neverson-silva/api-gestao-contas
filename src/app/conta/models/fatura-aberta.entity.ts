import { Lancamento } from '@app/conta/models/lancamento.entity';
import { Parcela } from '@app/conta/models/parcela.entity';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'lancamentos' })
export class FaturaAberta {
  @PrimaryColumn({ name: 'conta_id' })
  id: number;

  @ManyToOne(() => Pessoa, { eager: false })
  @JoinColumn({ name: 'devedor_id' })
  pessoa: Pessoa;

  @ManyToOne(() => Lancamento, { eager: false })
  @JoinColumn({ name: 'conta_id' })
  lancamento: Lancamento;

  @ManyToOne(() => Parcela, { eager: false })
  @JoinColumn({ name: 'parcela_id' })
  parcela: Parcela;

  isUltimaParcela(): boolean {
    return this.parcela.numero === this.lancamento.quantidadeParcelas;
  }
}
