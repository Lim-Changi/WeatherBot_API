import { ConfigService } from '@app/common/config/configService';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

class Application {
  private logger = new Logger(Application.name);
  private DEV_MODE: boolean;

  constructor(private server: NestExpressApplication) {
    this.server = server;
    this.DEV_MODE = process.env.NODE_ENV === 'production' ? false : true;
  }

  private swagger() {
    this.server.enableCors({
      origin: '*',
      methods: 'GET,POST,PUT,PATCH,DELETE',
      optionsSuccessStatus: 200,
    });
    const options = new DocumentBuilder()
      .setTitle('WeatherBot API')
      .setDescription('API Document')
      .build();

    const document = SwaggerModule.createDocument(this.server, options);
    SwaggerModule.setup('docs', this.server, document);
  }

  async bootstrap() {
    await this.swagger();
    await this.server.listen(ConfigService.appPort());
  }

  startLog() {
    if (this.DEV_MODE) {
      this.logger.log(
        `✅ Dev Server on http://localhost:${ConfigService.appPort()}`,
      );
    } else {
      this.logger.log(`✅ Prod Server on port ${ConfigService.appPort()}`);
    }
  }
}

async function bootstrap(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);

  const app = new Application(server);
  await app.bootstrap();
  app.startLog();
}

bootstrap().catch((error) => {
  new Logger('Init').error(error);
});
