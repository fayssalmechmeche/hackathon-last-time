import { IsUrl, IsNotEmpty } from 'class-validator';

export class AnalyzeOpenApiDto {
  @IsNotEmpty()
  @IsUrl()
  link: string;
}
export class SwaggerParameterDto {
  name: string;
  in: 'path' | 'query' | 'header' | 'body' | 'formData';
  type: string;
  format?: string;
  required: boolean;
  description?: string;
  enum?: string[];
  example?: any;
  schema?: any;
}

export class SwaggerRouteDto {
  path: string;
  method: string;
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters: SwaggerParameterDto[];
  responses: Record<string, any>;
  consumes?: string[];
  produces?: string[];
  security?: any[];
  deprecated?: boolean;
}

export class SwaggerDefinitionDto {
  name: string;
  type: string;
  properties?: Record<string, any>;
  required?: string[];
  description?: string;
}

export class SwaggerInfoDto {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: {
    name?: string;
    email?: string;
    url?: string;
  };
  license?: {
    name?: string;
    url?: string;
  };
}

export class SwaggerAnalysisResponseDto {
  info: SwaggerInfoDto;
  host?: string;
  basePath?: string;
  schemes?: string[];
  tags?: Array<{
    name: string;
    description?: string;
    externalDocs?: any;
  }>;
  routes: SwaggerRouteDto[];
  definitions: SwaggerDefinitionDto[];
  securityDefinitions?: Record<string, any>;
  totalRoutes: number;
  routesByMethod: Record<string, number>;
  routesByTag: Record<string, number>;
}
