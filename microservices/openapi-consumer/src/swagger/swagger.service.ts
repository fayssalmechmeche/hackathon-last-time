import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AnalyzeOpenApiDto } from './dto/analyze-openapi.dto';
import { firstValueFrom } from 'rxjs';
import { SwaggerDto } from './dto/format-openapi.dto';

@Injectable()
export class SwaggerService {
  constructor(private readonly httpService: HttpService) {}

  async analyzeOpenApi(body: AnalyzeOpenApiDto): Promise<any> {
    const response = await firstValueFrom(this.httpService.get(body.link));
    if (!response || !response.data) {
      throw new Error('Failed to fetch OpenAPI document');
    }

    const swagger = response.data as SwaggerDto;

    const routes = Object.entries(swagger.paths).map(([path, methods]) => {
      return Object.entries(methods).map(([method, operation]) => {
        return { path, method, operation };
      });
    });

    console.log(routes);

    return routes;
  }
}
