import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { BigIntInterceptor } from "./interceptor/big-int.Interceptor";
import { ValidationPipe } from "./pipe/validate.pipe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new BigIntInterceptor());

  const config = new DocumentBuilder()
    .setTitle("Banking AC")
    .setDescription("Documentação das api")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/doc", app, documentFactory);

  app.setGlobalPrefix("api");

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
