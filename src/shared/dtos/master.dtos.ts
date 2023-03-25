import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IResponse } from './../interfaces/response.interface';
import { BaseDataDto } from './base-data.dto';

export class CreateMasterDto extends BaseDataDto {
  @ApiProperty()
  @IsNumber()
  code: number;

  @ApiProperty()
  @IsString()
  text: string;
}

export class SearchMasterDto extends BaseDataDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(['DESC', 'ASC'])
  orderBy?: 'DESC' | 'ASC';
}

export class UpdateMasterDto {
  @ApiPropertyOptional()
  @IsOptional()
  code?: number;

  @ApiPropertyOptional()
  @IsOptional()
  text?: string;

  @ApiPropertyOptional()
  @IsOptional()
  deleted?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  updatedBy?: string;
}

export class MasterDto extends BaseDataDto {
  @ApiProperty()
  code: number;

  @ApiPropertyOptional()
  @IsOptional()
  text?: string;
}

export class MastersDto implements IResponse<MasterDto[]> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  error: string[];

  @ApiProperty()
  data: MasterDto[];

  @ApiProperty()
  currentPage?: number;

  @ApiProperty()
  perPage?: number;

  @ApiProperty()
  totalPage?: number;

  @ApiProperty()
  total?: number;
}
