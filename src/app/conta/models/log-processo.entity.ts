import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'log_processos' })
export class LogProcesso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;

  @Column()
  erro: string;

  @Column()
  sucesso: boolean;

  @CreateDateColumn()
  dataExecucao: Date;
}
