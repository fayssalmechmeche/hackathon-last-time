import { Controller, Post, Body } from '@nestjs/common';
import { SwaggerService } from './swagger.service';
import { AnalyzeOpenApiDto } from './dto/analyze-openapi.dto';

@Controller('swagger')
export class SwaggerController {
  constructor(private readonly swaggerService: SwaggerService) {}

  @Post('import')
  analyzeOpenApi(@Body() body: AnalyzeOpenApiDto) {
    console.log(body.link);
    return this.swaggerService.analyzeOpenApi(body);
  }
}
