import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { isValidValue } from '@utils/index';

export class AppPaginationDTO {
  @ApiProperty({ default: 1 })
  @Transform(({ value }) => (isValidValue(value) ? Number(value) : 1))
  page: number;

  @ApiProperty({ default: 10 })
  @Transform(({ value }) => (isValidValue(value) ? Number(value) : 10))
  linesPerPage: number;

  @ApiProperty({ default: 'id' })
  orderBy: string;

  @ApiProperty({ default: 'DESC' })
  direction: 'ASC' | 'DESC';
}
