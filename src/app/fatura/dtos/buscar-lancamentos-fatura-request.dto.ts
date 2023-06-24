import { ApiProperty } from '@nestjs/swagger';
import { mesUtil } from '@utils/meses';
import { AppPaginationDTO } from '@utils/dtos/pagination.dto';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import { Transform } from 'class-transformer';
import { isValidValue } from '@utils/index';

export class BuscarLancamentosFaturaRequestDTO extends AppPaginationDTO {
  @ApiProperty()
  @Transform(({ value }) => (isValidValue(value) ? Number(value) : value))
  idPessoa: number;

  @ApiProperty()
  @Transform(({ value }) => (isValidValue(value) ? Number(value) : value))
  idFormaPagamento: number;

  @ApiProperty()
  @Transform(({ value }) => (isValidValue(value) ? Number(value) : value))
  mes: number;

  @ApiProperty()
  @Transform(({ value }) => (isValidValue(value) ? Number(value) : value))
  ano: number;

  @ApiProperty({ default: false })
  somenteAtivos: boolean;

  @ApiProperty()
  searchKey: string;

  constructor(obj?: Partial<BuscarLancamentosFaturaRequestDTO>) {
    super();
    if (obj) {
      Object.assign(this, obj);
    }
  }

  getMesAno(): MesAnoDTO {
    return mesUtil.getMesAnoReferencia({
      mes: this.mes,
      ano: this.ano,
    });
  }
}
