import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.schema';

// El CONTROLADOR define las rutas HTTP. Atiende las peticiones
// y le pasa el trabajo al servicio.
// Con el prefijo global '/api' (en main.ts), la ruta queda en /api/products
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET /api/products → devuelve la lista de productos (en JSON)
  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  // POST /api/products → crea un producto con los datos recibidos (en JSON)
  @Post()
  create(@Body() datos: Product): Promise<Product> {
    return this.productsService.create(datos);
  }
}
