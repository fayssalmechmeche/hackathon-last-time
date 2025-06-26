/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AnalyzeOpenApiDto } from './dto/analyze-openapi.dto';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import * as yaml from 'js-yaml';

@Injectable()
export class SwaggerService {
  constructor(private readonly httpService: HttpService) {}

  async analyzeOpenApi(body: AnalyzeOpenApiDto): Promise<any> {
    const response = await firstValueFrom(this.httpService.get(body.link));
    if (!response || !response.data) {
      throw new Error('Failed to fetch OpenAPI document');
    }

    let swagger: any;

    // Déterminer le type de contenu et parser en conséquence
    if (body.link.endsWith('.yaml') || body.link.endsWith('.yml')) {
      // Si c'est une chaîne, c'est probablement du YAML
      try {
        swagger = yaml.load(response.data) as any;
      } catch (yamlError) {
        // Si le parsing YAML échoue, essayer de parser comme JSON
        try {
          swagger = JSON.parse(response.data);
        } catch (jsonError) {
          throw new Error('Failed to parse OpenAPI document as YAML or JSON');
        }
      }
    } else {
      // Si c'est déjà un objet, c'est du JSON parsé automatiquement
      swagger = response.data;
    }

    // Vérifier que c'est bien un document OpenAPI/Swagger valide
    if (!swagger || (!swagger.swagger && !swagger.openapi)) {
      throw new Error('Invalid OpenAPI/Swagger document');
    }

    const jsonSchema = this.formatJsonSchema(swagger);
    return jsonSchema;
  }

  /**
   * Détecte le type de contenu basé sur l'URL ou les headers
   */
  private detectContentType(
    url: string,
    contentType?: string,
  ): 'yaml' | 'json' {
    if (contentType) {
      if (contentType.includes('yaml') || contentType.includes('yml')) {
        return 'yaml';
      }
      if (contentType.includes('json')) {
        return 'json';
      }
    }

    // Fallback sur l'extension du fichier
    if (url.endsWith('.yaml') || url.endsWith('.yml')) {
      return 'yaml';
    }

    return 'json'; // Par défaut
  }

  formatJsonSchema(swagger: any): any {
    const service = swagger;
    const serviceId = uuidv4();

    const paths = swagger.paths;

    // Fonction helper pour convertir les types OpenAPI vers JSON Schema
    const convertType = (type: string, format?: string) => {
      switch (type) {
        case 'integer':
          return format === 'int64'
            ? { type: 'integer', format: 'int64' }
            : { type: 'integer' };
        case 'number':
          return { type: 'number' };
        case 'string':
          return format ? { type: 'string', format } : { type: 'string' };
        case 'boolean':
          return { type: 'boolean' };
        case 'array':
          return { type: 'array', items: { type: 'string' } }; // Par défaut, array de strings
        case 'file':
          return { type: 'string', format: 'binary' };
        case 'object':
          return { type: 'object' };
        default:
          return { type: 'string' };
      }
    };

    // Construire les propriétés des routes
    const routeProperties: Record<string, any> = {};

    // Itérer sur les chemins (paths) et les méthodes HTTP
    Object.entries(paths).forEach(([pathKey, pathMethods]: [string, any]) => {
      Object.entries(pathMethods).forEach(
        ([method, operation]: [string, any]) => {
          const routeKey = `${method.toLowerCase()}_${pathKey.replace(/[{}]/g, '')}`;
          const routeParameters = operation.parameters || [];

          // Séparer les paramètres par type (path, query, body, formData, header)
          const pathParams = routeParameters.filter(
            (p: any) => p.in === 'path',
          );
          const queryParams = routeParameters.filter(
            (p: any) => p.in === 'query',
          );
          const bodyParams = routeParameters.filter(
            (p: any) => p.in === 'body',
          );
          const formDataParams = routeParameters.filter(
            (p: any) => p.in === 'formData',
          );
          const headerParams = routeParameters.filter(
            (p: any) => p.in === 'header',
          );

          const routeSchema: any = {
            type: 'object',
            title: operation.summary || `${method.toUpperCase()} ${pathKey}`,
            description: operation.description || '',
            properties: {},
          };

          // Ajouter les paramètres de chemin
          if (pathParams.length > 0) {
            routeSchema.properties.pathParameters = {
              type: 'object',
              required: pathParams
                .filter((p: any) => p.required)
                .map((p: any) => p.name),
              properties: {},
            };

            pathParams.forEach((param: any) => {
              routeSchema.properties.pathParameters.properties[param.name] = {
                ...convertType(param.type, param.format || undefined),
                description: param.description,
              };
            });
          }

          // Ajouter les paramètres de requête
          if (queryParams.length > 0) {
            routeSchema.properties.queryParameters = {
              type: 'object',
              required: queryParams
                .filter((p: any) => p.required)
                .map((p: any) => p.name),
              properties: {},
            };

            queryParams.forEach((param: any) => {
              routeSchema.properties.queryParameters.properties[param.name] = {
                ...convertType(param.type, param.format || undefined),
                description: param.description,
              };
            });
          }

          // Ajouter les paramètres de corps
          if (bodyParams.length > 0) {
            const bodyParam = bodyParams[0]; // Généralement un seul paramètre body
            routeSchema.properties.body = {
              ...convertType(bodyParam.type, bodyParam.format || undefined),
              description: bodyParam.description,
            };

            if (bodyParam.required) {
              routeSchema.required = routeSchema.required || [];
              routeSchema.required.push('body');
            }
          }

          // Ajouter les paramètres de form data
          if (formDataParams.length > 0) {
            routeSchema.properties.formData = {
              type: 'object',
              required: formDataParams
                .filter((p: any) => p.required)
                .map((p: any) => p.name),
              properties: {},
            };

            formDataParams.forEach((param: any) => {
              routeSchema.properties.formData.properties[param.name] = {
                ...convertType(param.type, param.format || undefined),
                description: param.description,
              };
            });
          }

          // Ajouter les paramètres d'en-tête
          if (headerParams.length > 0) {
            routeSchema.properties.headers = {
              type: 'object',
              required: headerParams
                .filter((p: any) => p.required)
                .map((p: any) => p.name),
              properties: {},
            };

            headerParams.forEach((param: any) => {
              routeSchema.properties.headers.properties[param.name] = {
                ...convertType(param.type, param.format || undefined),
                description: param.description,
              };
            });
          }

          routeProperties[routeKey] = routeSchema;
        },
      );
    });

    // Construire le schéma JSON Schema complet
    const jsonSchema = {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      $id: `https://api.example.com/schemas/${serviceId}`,
      host: service.host,
      title: service.info?.title || 'API Service',
      description: service.info?.description || '',
      type: 'object',
      properties: {
        service: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            service_name: { type: 'string' },
            service_description: { type: 'string' },
            service_url: { type: 'string', format: 'uri' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'service_name', 'service_url'],
        },
        routes: {
          type: 'object',
          properties: routeProperties,
          additionalProperties: false,
        },
      },
      required: ['service', 'routes'],
      additionalProperties: false,
    };

    return jsonSchema;
  }
}
