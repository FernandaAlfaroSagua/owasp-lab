import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Order])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
