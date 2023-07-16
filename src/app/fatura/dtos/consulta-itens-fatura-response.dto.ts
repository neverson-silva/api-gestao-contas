import { FaturaItem } from '@app/fatura/models/fatura-item.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Page } from '@utils/dtos/page.dto';

export class ConsultaItensFaturaResponseDTO {
  @ApiProperty()
  valorTotal: number;

  @ApiProperty({ type: () => [FaturaItem] })
  itens: Page<FaturaItem>;

  constructor(valorTotal?: number, itens?: Page<FaturaItem>) {
    this.valorTotal = valorTotal;
    this.itens = itens;
  }
}
