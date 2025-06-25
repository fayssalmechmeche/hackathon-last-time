import { Module } from '@nestjs/common';
import { SwaggerController } from './swagger.controller';
import { SwaggerService } from './swagger.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [SwaggerController],
  providers: [SwaggerService],
  imports: [HttpModule],
})
export class SwaggerModule {}
