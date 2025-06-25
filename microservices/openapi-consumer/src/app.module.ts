import { Module } from '@nestjs/common';
import { SwaggerModule } from './swagger/swagger.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [SwaggerModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
