import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// ESQUEMA: la "ficha" que describe cómo es un producto dentro de MongoDB.
// Mongoose lo usa para comprobar los datos antes de guardarlos.
// Los productos se guardarán en la colección "products".
@Schema({ collection: 'products' })
export class Product {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  marca: string;

  // Lista cerrada: solo se admiten estas categorías
  @Prop({
    required: true,
    enum: ['portátil', 'móvil', 'tablet', 'audio', 'accesorio'],
  })
  categoria: string;

  @Prop({ required: true })
  precio: number;

  // Si no se indica, vale 0
  @Prop({ default: 0 })
  stock: number;
}

// Convierte la clase anterior en un esquema que Mongoose entiende
export const ProductSchema = SchemaFactory.createForClass(Product);
