import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn, IsNumber } from 'class-validator';
import { BaseDataDto } from './base-data.dto';

enum OrderBy {
  DESC = 'DESC',
  ASC = 'ASC',
}

export abstract class BaseSearchDataDto extends BaseDataDto {
  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsNumber()
  //   id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  size?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ type: 'enum', enum: OrderBy })
  @IsOptional()
  @IsString()
  @IsIn(['DESC', 'ASC'])
  orderBy?: 'DESC' | 'ASC';
}
