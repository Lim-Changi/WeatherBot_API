import { ValidationSchema } from '@app/common/config/validationSchema';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ValidationSchema,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
