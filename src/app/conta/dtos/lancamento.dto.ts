import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform } from 'class-transformer';
import * as moment from 'moment';
import { ApiProperty } from '@nestjs/swagger';

export class PessoaDivisaoLancamentoDTO {
  id: number;
  valor: number;
}
export class DivisaoLancamentoDTO {
  igualmente: boolean;
  diferente: boolean;
  pessoas: PessoaDivisaoLancamentoDTO[] = [];
}

export class LancamentoDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
  })
  descricao?: string;

  @IsNotEmpty({ message: 'Nome da compra não informado' })
  @IsString()
  @ApiProperty({
    required: true,
  })
  nome: string;

  @IsNumber({}, { message: 'Valor de ser um number' })
  @IsPositive({
    message: 'Valor da compra é obrigatório e precisa ser maior que 0',
  })
  @ApiProperty({
    required: true,
  })
  valor: number;

  @IsNumber()
  @Min(1, {
    message:
      'Mês referencia deve ser informado e ser maior que 1 e menor que 12',
  })
  @Max(12, {
    message:
      'Mês referencia deve ser informado e ser maior que 1 e menor que 12',
  })
  @ApiProperty({
    required: true,
  })
  mesReferencia: number;

  @IsNumber({}, { message: 'Forma de pagamento é obrigatória' })
  @ApiProperty({
    required: true,
  })
  formaPagamentoId: number;

  @IsNumber({}, { message: 'Dono da compra é obrigatória' })
  @ApiProperty({
    required: true,
  })
  idPessoa: number;

  @IsOptional()
  @ValidateNested()
  @ApiProperty({
    required: false,
    type: DivisaoLancamentoDTO,
  })
  divisao?: DivisaoLancamentoDTO;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    required: false,
  })
  parcelado?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
  })
  quantidadeParcelas?: number;

  @IsOptional()
  @Transform(({ value }) => {
    return value ? moment(value).toDate() : value;
  })
  @ApiProperty({
    required: false,
  })
  dataCompra?: Date;
}
