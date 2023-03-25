import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, IsDate } from 'class-validator';
import { TransformBoolean } from '../decorators/transform-boolean.decorator';

export abstract class BaseDataDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
    active?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
    deleted?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
    createdAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
    createdBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
    updatedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
    updatedBy?: string;
}
