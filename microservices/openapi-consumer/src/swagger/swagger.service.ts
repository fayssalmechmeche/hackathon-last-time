/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AnalyzeOpenApiDto } from './dto/analyze-openapi.dto';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Kysely, PostgresDialect } from 'kysely';
import { DB } from 'src/db/schema';
import { Pool } from 'pg';

@Injectable()
export class SwaggerService {
  private readonly db: Kysely<DB>;

  constructor(private readonly httpService: HttpService) {
    this.db = new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: process.env.DATABASE_URL,
        }),
      }),
    });
  }

  async analyzeOpenApi(body: AnalyzeOpenApiDto): Promise<any> {
    const response = await firstValueFrom(this.httpService.get(body.link));
    if (!response || !response.data) {
      throw new Error('Failed to fetch OpenAPI document');
    }

    const swagger = response.data;
    const service = swagger.info;
    const paths = swagger.paths;

    const serviceId = uuidv4();

    try {
      await this.db
        .insertInto('services')
        .values({
          id: serviceId,
          service_name: service.title,
          service_description: service.description || '',
          service_url: body.link,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .execute();

      // Fix: Iterate over the paths object correctly
      for (const [pathKey, pathValue] of Object.entries(paths)) {
        console.log('Processing path:', pathKey);

        // Type guard to ensure pathValue is an object
        if (!pathValue || typeof pathValue !== 'object') {
          continue;
        }

        // pathValue contains the HTTP methods (get, post, put, delete, etc.)
        for (const [httpMethod, methodDetails] of Object.entries(
          pathValue as Record<string, any>,
        )) {
          // Skip non-HTTP method properties (like parameters, summary, etc.)
          if (
            ![
              'get',
              'post',
              'put',
              'delete',
              'patch',
              'options',
              'head',
              'trace',
            ].includes(httpMethod.toLowerCase())
          ) {
            continue;
          }

          // Type guard to ensure methodDetails is an object
          if (!methodDetails || typeof methodDetails !== 'object') {
            continue;
          }

          const methodDetailsObj = methodDetails as Record<string, any>;
          const routeId = uuidv4();

          await this.db
            .insertInto('service_routes')
            .values({
              id: routeId,
              route_description: methodDetailsObj.description || '',
              route_method: httpMethod.toUpperCase(),
              route_operation_id: methodDetailsObj.operationId || '',
              route_path: pathKey,
              route_summary: methodDetailsObj.summary || '',
              service_id: serviceId,
              created_at: new Date(),
            })
            .execute();

          // Handle parameters if they exist
          if (
            methodDetailsObj.parameters &&
            Array.isArray(methodDetailsObj.parameters)
          ) {
            for (const param of methodDetailsObj.parameters) {
              if (param && typeof param === 'object') {
                const parameterId = uuidv4();
                await this.db
                  .insertInto('service_route_parameters')
                  .values({
                    id: parameterId,
                    service_route_id: routeId,
                    parameter_name: param.name || '',
                    parameter_in: param.in || '',
                    parameter_description: param.description || '',
                    parameter_required: param.required === true,
                    parameter_type:
                      param.type || param.schema?.type || 'string',
                    parameter_format:
                      param.format || param.schema?.format || '',
                    created_at: new Date(),
                  })
                  .execute();
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
    const jsonSchema = await this.formatJsonSchema(serviceId);
    return jsonSchema;
  }
  async formatJsonSchema(serviceId: string): Promise<any> {
    const service = await this.db
      .selectFrom('services')
      .selectAll()
      .where('id', '=', serviceId)
      .executeTakeFirst();

    const routes = await this.db
      .selectFrom('service_routes')
      .selectAll()
      .where('service_id', '=', serviceId)
      .execute();

    const parameters = await this.db
      .selectFrom('service_route_parameters')
      .selectAll()
      .where(
        'service_route_id',
        'in',
        routes.map((route) => route.id),
      )
      .execute();

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

    routes.forEach((route) => {
      const routeKey = `${route.route_method.toLowerCase()}_${route.route_path}`;
      const routeParameters = parameters.filter(
        (parameter) => parameter.service_route_id === route.id,
      );

      // Séparer les paramètres par type (path, query, body, formData, header)
      const pathParams = routeParameters.filter(
        (p) => p.parameter_in === 'path',
      );
      const queryParams = routeParameters.filter(
        (p) => p.parameter_in === 'query',
      );
      const bodyParams = routeParameters.filter(
        (p) => p.parameter_in === 'body',
      );
      const formDataParams = routeParameters.filter(
        (p) => p.parameter_in === 'formData',
      );
      const headerParams = routeParameters.filter(
        (p) => p.parameter_in === 'header',
      );

      const routeSchema: any = {
        type: 'object',
        title:
          route.route_summary || `${route.route_method} ${route.route_path}`,
        description: route.route_description || '',
        properties: {},
      };

      // Ajouter les paramètres de chemin
      if (pathParams.length > 0) {
        routeSchema.properties.pathParameters = {
          type: 'object',
          required: pathParams
            .filter((p) => p.parameter_required)
            .map((p) => p.parameter_name),
          properties: {},
        };

        pathParams.forEach((param) => {
          routeSchema.properties.pathParameters.properties[
            param.parameter_name
          ] = {
            ...convertType(
              param.parameter_type,
              param.parameter_format || undefined,
            ),
            description: param.parameter_description,
          };
        });
      }

      // Ajouter les paramètres de requête
      if (queryParams.length > 0) {
        routeSchema.properties.queryParameters = {
          type: 'object',
          required: queryParams
            .filter((p) => p.parameter_required)
            .map((p) => p.parameter_name),
          properties: {},
        };

        queryParams.forEach((param) => {
          routeSchema.properties.queryParameters.properties[
            param.parameter_name
          ] = {
            ...convertType(
              param.parameter_type,
              param.parameter_format || undefined,
            ),
            description: param.parameter_description,
          };
        });
      }

      // Ajouter les paramètres de corps
      if (bodyParams.length > 0) {
        const bodyParam = bodyParams[0]; // Généralement un seul paramètre body
        routeSchema.properties.body = {
          ...convertType(
            bodyParam.parameter_type,
            bodyParam.parameter_format || undefined,
          ),
          description: bodyParam.parameter_description,
        };

        if (bodyParam.parameter_required) {
          routeSchema.required = routeSchema.required || [];
          routeSchema.required.push('body');
        }
      }

      // Ajouter les paramètres de form data
      if (formDataParams.length > 0) {
        routeSchema.properties.formData = {
          type: 'object',
          required: formDataParams
            .filter((p) => p.parameter_required)
            .map((p) => p.parameter_name),
          properties: {},
        };

        formDataParams.forEach((param) => {
          routeSchema.properties.formData.properties[param.parameter_name] = {
            ...convertType(
              param.parameter_type || '',
              param.parameter_format || undefined,
            ),
            description: param.parameter_description,
          };
        });
      }

      // Ajouter les paramètres d'en-tête
      if (headerParams.length > 0) {
        routeSchema.properties.headers = {
          type: 'object',
          required: headerParams
            .filter((p) => p.parameter_required)
            .map((p) => p.parameter_name),
          properties: {},
        };

        headerParams.forEach((param) => {
          routeSchema.properties.headers.properties[param.parameter_name] = {
            ...convertType(
              param.parameter_type || '',
              param.parameter_format || undefined,
            ),
            description: param.parameter_description,
          };
        });
      }

      routeProperties[routeKey] = routeSchema;
    });

    // Construire le schéma JSON Schema complet
    const jsonSchema = {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      $id: `https://api.example.com/schemas/${serviceId}`,
      title: service?.service_name || 'API Service',
      description: service?.service_description || '',
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

    console.log('Generated JSON Schema:', JSON.stringify(jsonSchema, null, 2));

    return jsonSchema;
  }
}
