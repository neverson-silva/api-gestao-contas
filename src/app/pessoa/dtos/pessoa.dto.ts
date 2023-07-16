import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import * as moment from 'moment';

export class PessoaDto {
  @IsNotEmpty({ message: 'Nome não informado' })
  @ApiProperty({ required: true })
  nome: string;

  @IsNotEmpty({ message: 'Sobrenome não informado' })
  @ApiProperty({ required: true })
  sobrenome: string;

  @IsOptional()
  @ApiProperty({ required: false })
  apelido?: string;

  @Transform(({ value }) => (value ? moment(value).toDate() : value))
  dataNascimento?: Date;
}
