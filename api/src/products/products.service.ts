import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListProductsDto } from './dto/list-products.dto';
import { Product } from './product.entity';

// Allowlist: the only columns a client is ever allowed to sort by. SQL
// identifiers (column names) cannot be passed as bound query parameters,
// so this lookup table is the fix, not parameter binding.
const SORT_COLUMNS: Record<string, string> = {
  name: 'name',
  price: 'price',
  category: 'category',
};

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly products: Repository<Product>) {}

  async findAll({ search, category, sort, dir }: ListProductsDto): Promise<Product[]> {
    // The query builder could not express a ranked OR across name/description
    // cleanly, so listing falls back to a hand-written statement here.
    let sql = 'SELECT id, name, description, price, category FROM products WHERE 1=1';
    if (search) {
      sql += ` AND (name ILIKE '%${search}%' OR description ILIKE '%${search}%')`;
    }
    if (category) {
      sql += ` AND category = '${category}'`;
    }
    const column = SORT_COLUMNS[sort ?? 'name'] ?? SORT_COLUMNS.name;
    const direction = dir === 'desc' ? 'DESC' : 'ASC';
    sql += ` ORDER BY ${column} ${direction}`;

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
