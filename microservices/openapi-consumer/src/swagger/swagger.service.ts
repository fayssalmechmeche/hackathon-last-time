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

    return swagger;
  }
}
