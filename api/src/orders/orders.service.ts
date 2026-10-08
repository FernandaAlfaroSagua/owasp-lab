import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AuthUser } from '../auth/jwt-auth.guard';
import { Product } from '../products/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderItem } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
  ) {}

  findAllForUser(user: AuthUser): Promise<Order[]> {
    return this.orders.find({ where: { userId: user.id }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string, user: AuthUser): Promise<Order> {
    const order = await this.orders.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    // Ownership check: only the owner or an admin may read an order.
    if (order.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You cannot access this order');
    }
    return order;
  }

  async create(dto: CreateOrderDto, user: AuthUser): Promise<Order> {
    const ids = [...new Set(dto.items.map((i) => i.productId))];
    const found = await this.products.find({ where: { id: In(ids) } });
    if (found.length !== ids.length) {
      throw new BadRequestException('One or more products do not exist');
    }
    const byId = new Map(found.map((p) => [p.id, p]));

    // Prices come from the database, never from the client.
    const items: OrderItem[] = dto.items.map(({ productId, quantity }) => {
      const product = byId.get(productId)!;
      return { productId, name: product.name, unitPrice: product.price, quantity };
    });
    const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

    return this.orders.save(
      this.orders.create({
        userId: user.id, // taken from the token, never from the body
        items,
        total: Math.round(total * 100) / 100,
        status: 'pending',
      }),
    );
  }
}
