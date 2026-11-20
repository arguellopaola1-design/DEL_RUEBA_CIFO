import { Injectable } from '@nestjs/common';

// Forma que tiene un producto (el mismo modelo que en la fase 1)
export interface Product {
  nombre: string;
  marca: string;
  categoria: string; // portátil, móvil, tablet, audio o accesorio
  precio: number;
  stock: number;
}

// El SERVICIO es la lógica: aquí se guardan y se leen los productos.
@Injectable()
export class ProductsService {
  // Array en la memoria del SERVIDOR (ya no del navegador).
  // Si el servidor se para, esta lista se pierde.
  private readonly productos: Product[] = [];

  // Devuelve todos los productos
  findAll(): Product[] {
    return this.productos;
  }

  // Añade un producto nuevo y lo devuelve
  create(datos: Product): Product {
    const producto: Product = {
      nombre: datos.nombre,
      marca: datos.marca,
      categoria: datos.categoria,
      precio: Number(datos.precio),
      stock: Number(datos.stock) || 0, // si no llega, 0
    };
    this.productos.push(producto);
    return producto;
  }
}
