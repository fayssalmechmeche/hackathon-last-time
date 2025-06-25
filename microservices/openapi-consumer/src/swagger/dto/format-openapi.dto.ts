import {
  IsString,
  IsObject,
  ValidateNested,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SwaggerInfoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class SwaggerDto {
  @IsString()
  @IsNotEmpty()
  swagger: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SwaggerInfoDto)
  info: SwaggerInfoDto;

  @IsObject()
  paths: Record<string, any>;

  @IsString()
  @IsOptional()
  host?: string;

  @IsString()
  @IsOptional()
  basePath?: string;

  @IsOptional()
  schemes?: string[];

  @IsOptional()
  consumes?: string[];

  @IsOptional()
  produces?: string[];

  @IsObject()
  @IsOptional()
  definitions?: Record<string, any>;

  @IsOptional()
  @IsOptional()
  tags?: any[];

  @IsObject()
  @IsOptional()
  securityDefinitions?: Record<string, any>;

  @IsObject()
  @IsOptional()
  externalDocs?: Record<string, any>;
}
