import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsObject,
  IsBoolean,
} from 'class-validator';

export class SwaggerInfoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  host: string;

  @IsString()
  @IsNotEmpty()
  basePath: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SwaggerPathDto)
  paths: SwaggerPathDto[];
}

export class SwaggerPathDto {
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SwaggerRouteDto)
  routes: SwaggerRouteDto[];
}

export class SwaggerRouteDto {
  @IsString()
  @IsNotEmpty()
  method: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  operationId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SwaggerParameterDto)
  parameters: SwaggerParameterDto[];
}

export class SwaggerParameterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  in: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  required: boolean;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  format: string;
}
