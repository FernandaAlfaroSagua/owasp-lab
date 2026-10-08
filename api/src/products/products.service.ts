import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListProductsDto } from './dto/list-products.dto';
import { Product } from './product.entity';

// Allowlist: the only columns a client is ever allowed to sort by. SQL
// identifiers (column names) cannot be passed as bound query parameters,
// so this lookup table is the fix, not parameter binding.
const SORT_COLUMNS: Record<string, string> = {
  name: 'product.name',
  price: 'product.price',
  category: 'product.category',
};

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly products: Repository<Product>) {}

  findAll({ search, category, sort, dir }: ListProductsDto): Promise<Product[]> {
    const qb = this.products.createQueryBuilder('product');

    // User input is always bound as a named parameter, never concatenated into SQL.
    if (search) {
      qb.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    if (category) {
      qb.andWhere('product.category = :category', { category });
    }

    const column = SORT_COLUMNS[sort ?? 'name'] ?? SORT_COLUMNS.name;
    qb.orderBy(column, dir === 'desc' ? 'DESC' : 'ASC');

    return qb.getMany();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.products.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
