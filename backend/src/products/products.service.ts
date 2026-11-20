import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';

// El SERVICIO es la lógica: aquí se guardan y se leen los productos.
// Fase 3: ya NO hay array. Los productos se guardan en MongoDB (el "almacén"),
// así que no se pierden aunque el servidor se apague.
@Injectable()
export class ProductsService {
  // productModel es la "puerta" a la colección "products" de MongoDB
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  // Devuelve todos los productos guardados en MongoDB
  // (async/await: hay que esperar a que la base de datos responda)
  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  // Guarda un producto nuevo en MongoDB y lo devuelve.
  // Antes de guardarlo, Mongoose lo comprueba con el esquema (product.schema.ts).
  async create(datos: Product): Promise<Product> {
    const producto = new this.productModel(datos);
    return producto.save();
  }
}
