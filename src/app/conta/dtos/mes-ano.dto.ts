import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Mes } from '../models/mes.entity';
import { ApiProperty } from '@nestjs/swagger';

export class MesAnoDTO {
  @IsNotEmpty({
    message: 'Mês de referência obrigatório',
  })
  @Transform(({ value }) => Number(value))
  @ApiProperty()
  mesReferencia: number;

  @IsNotEmpty({
    message: 'ano de referência obrigatório',
  })
  @Transform(({ value }) => Number(value))
  @ApiProperty()
  anoReferencia: number;

  @ApiProperty()
  mes?: Mes;

  constructor(obj?: Partial<MesAnoDTO>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
