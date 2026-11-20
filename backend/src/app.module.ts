import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

// Módulo principal: reúne todas las piezas del backend
@Module({
  imports: [
    // Sirve los archivos de la carpeta /frontend (index.html, styles.css, app.js)
    // en http://localhost:3000/
    ServeStaticModule.forRoot({
      // __dirname es backend/dist al ejecutarse → subimos dos niveles hasta actividad01/frontend
      rootPath: join(__dirname, '..', '..', 'frontend'),
      // Las rutas que empiezan por /api son de la API, no archivos del frontend
      exclude: ['/api/{*ruta}'],
    }),
    // Conexión con la base de datos MongoDB (el "almacén"):
    // - En Render: se usa la variable de entorno MONGODB_URI (la dirección de MongoDB Atlas).
    // - En local: si no existe esa variable, se usa el MongoDB de este ordenador
    //   (localhost:27017, base de datos actividad01).
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://localhost:27017/actividad01',
    ),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
