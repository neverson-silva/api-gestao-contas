import { IMesRepository } from '@app/conta/interfaces/mes.repository.interface';
import { Controller, Get, Inject } from '@nestjs/common';
import { mesUtil } from '@utils/meses';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller({ version: '1', path: 'meses' })
@ApiTags('Meses')
@ApiBearerAuth()
export class MesController {
  constructor(
    @Inject('IMesRepository')
    private readonly mesRepository: IMesRepository,
  ) {}

  @Get('mesAtual')
  @ApiOkResponse({
    type: MesAnoDTO,
  })
  @ApiOperation({ description: 'Retorna o mes atual da fatura' })
  async buscarMesAtual(): Promise<MesAnoDTO> {
    const mesAtual = await this.mesRepository.findOneBy({ atual: true });
    return mesUtil.getMesAno(mesAtual);
  }
}
