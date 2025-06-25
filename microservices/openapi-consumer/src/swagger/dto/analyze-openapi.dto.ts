import { IsString } from 'class-validator';

export class AnalyzeOpenApiDto {
  @IsString()
  link: string;
}
