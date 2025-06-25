import { Module } from '@nestjs/common';
import { SwaggerModule } from './swagger/swagger.module';
@Module({
  imports: [SwaggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
