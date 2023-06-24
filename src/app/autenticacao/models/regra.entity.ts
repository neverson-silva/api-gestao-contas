import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'regras' })
export class Regra {
  @PrimaryGeneratedColumn({ name: 'regra_id' })
  id: number;

  @Column()
  authority: string;
}
