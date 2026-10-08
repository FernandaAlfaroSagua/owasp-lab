import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Order, OrderItem, OrderStatus } from '../orders/order.entity';
import { Product } from '../products/product.entity';
import { User, UserRole } from '../users/user.entity';

// Development-only credentials. They are documented in the README on purpose.
const USERS: { email: string; name: string; password: string; role: UserRole }[] = [
  { email: 'alice@lab.test', name: 'Alice', password: 'alice-pass-1', role: 'user' },
  { email: 'bob@lab.test', name: 'Bob', password: 'bob-pass-1', role: 'user' },
  { email: 'admin@lab.test', name: 'Admin', password: 'admin-pass-1', role: 'admin' },
];

const PRODUCTS: Pick<Product, 'name' | 'description' | 'price' | 'category'>[] = [
  { name: 'Mechanical Keyboard', description: 'Tenkeyless keyboard with brown switches.', price: 89.9, category: 'electronics' },
  { name: 'Wireless Mouse', description: 'Ergonomic mouse with a 12 month battery.', price: 34.5, category: 'electronics' },
  { name: 'USB-C Hub', description: 'Seven port hub with HDMI and card reader.', price: 49.0, category: 'electronics' },
  { name: 'Noise Cancelling Headphones', description: 'Over-ear headphones with 30 hour battery.', price: 199.0, category: 'electronics' },
  { name: 'Standing Desk Mat', description: 'Anti-fatigue mat for long coding sessions.', price: 42.0, category: 'office' },
  { name: 'Notebook A5', description: 'Dotted notebook, 200 pages.', price: 9.5, category: 'office' },
  { name: 'Desk Lamp', description: 'Adjustable LED lamp with warm and cool modes.', price: 27.99, category: 'office' },
  { name: 'Monitor Arm', description: 'Single monitor arm with gas spring.', price: 64.0, category: 'office' },
  { name: 'Clean Code', description: 'A handbook of agile software craftsmanship.', price: 38.0, category: 'books' },
  { name: 'The Pragmatic Programmer', description: 'Your journey to mastery, 20th anniversary edition.', price: 41.0, category: 'books' },
  { name: 'Designing Data-Intensive Applications', description: 'The big ideas behind reliable systems.', price: 55.0, category: 'books' },
  { name: 'Web Application Hacker Handbook', description: 'Finding and exploiting security flaws.', price: 47.5, category: 'books' },
  { name: 'Coffee Beans 1kg', description: 'Medium roast arabica beans.', price: 21.0, category: 'kitchen' },
  { name: 'Insulated Bottle', description: 'Stainless steel bottle, keeps drinks hot for 12 hours.', price: 19.9, category: 'kitchen' },
  { name: 'Pour Over Set', description: 'Glass dripper with reusable filter.', price: 29.0, category: 'kitchen' },
];

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(Order) private readonly orders: Repository<Order>,
  ) {}

  async seedIfEmpty(): Promise<void> {
    if ((await this.users.count()) > 0) {
      return;
    }
    this.logger.log('Empty database detected, seeding');
    await this.insertAll();
  }

  /** Wipes users, products and orders, then seeds them again. */
  async reset(): Promise<void> {
    await this.orders.createQueryBuilder().delete().execute();
    await this.products.createQueryBuilder().delete().execute();
    await this.users.createQueryBuilder().delete().execute();
    await this.insertAll();
  }

  private async insertAll(): Promise<void> {
    const users = await this.users.save(
      await Promise.all(
        USERS.map(async ({ email, name, password, role }) =>
          this.users.create({ email, name, role, passwordHash: await bcrypt.hash(password, 10) }),
        ),
      ),
    );
    const products = await this.products.save(PRODUCTS.map((p) => this.products.create(p)));

    const alice = users.find((u) => u.email.startsWith('alice'))!;
    const bob = users.find((u) => u.email.startsWith('bob'))!;
    const byName = (name: string) => products.find((p) => p.name === name)!;

    const line = (name: string, quantity: number): OrderItem => {
      const p = byName(name);
      return { productId: p.id, name: p.name, unitPrice: p.price, quantity };
    };
    const order = (userId: string, items: OrderItem[], status: OrderStatus) =>
      this.orders.create({
        userId,
        items,
        status,
        total: Math.round(items.reduce((s, i) => s + i.unitPrice * i.quantity, 0) * 100) / 100,
      });

    await this.orders.save([
      order(alice.id, [line('Mechanical Keyboard', 1), line('Wireless Mouse', 1)], 'shipped'),
      order(alice.id, [line('Clean Code', 2)], 'paid'),
      order(alice.id, [line('Coffee Beans 1kg', 3)], 'pending'),
      order(bob.id, [line('Noise Cancelling Headphones', 1)], 'paid'),
      order(bob.id, [line('Desk Lamp', 1), line('Notebook A5', 4)], 'pending'),
    ]);

    this.logger.log(`Seeded ${users.length} users, ${products.length} products, 5 orders`);
  }
}
