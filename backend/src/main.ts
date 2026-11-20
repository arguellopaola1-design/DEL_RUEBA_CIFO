import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Punto de arranque del servidor
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Todas las rutas de la API empiezan por /api (por ejemplo, /api/products)
  app.setGlobalPrefix('api');

  // El servidor escucha en el puerto 3000 → http://localhost:3000
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
