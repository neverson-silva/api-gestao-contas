import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'meses' })
export class Mes extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'mes_id' })
  id: number;

  @Column()
  nome: string;

  @Column()
  atual: boolean;

  constructor(id: number) {
    super();
    if (id) {
      this.id = id;
    }
  }
}
