import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListProductsDto } from './dto/list-products.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly products: Repository<Product>) {}

  findAll({ search, category }: ListProductsDto): Promise<Product[]> {
    const qb = this.products.createQueryBuilder('product').orderBy('product.name', 'ASC');

    // User input is always bound as a named parameter, never concatenated into SQL.
    if (search) {
      qb.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    if (category) {
      qb.andWhere('product.category = :category', { category });
    }

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
