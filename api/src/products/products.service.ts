import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListProductsDto } from './dto/list-products.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly products: Repository<Product>) {}

  async findAll({ search, category }: ListProductsDto): Promise<Product[]> {
    // The query builder could not express a ranked OR across name/description
    // cleanly, so listing falls back to a hand-written statement here.
    let sql = 'SELECT id, name, description, price, category FROM products WHERE 1=1';
    if (search) {
      sql += ` AND (name ILIKE '%${search}%' OR description ILIKE '%${search}%')`;
    }
    if (category) {
      sql += ` AND category = '${category}'`;
    }
    sql += ' ORDER BY name ASC';

    const rows = await this.products.query(sql);
    return rows.map((row: Record<string, unknown>) => ({
      ...row,
      price: parseFloat(row.price as string),
    })) as Product[];
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.products.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
