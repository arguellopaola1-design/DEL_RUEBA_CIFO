import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

// El MÓDULO agrupa todo lo relacionado con los productos
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
