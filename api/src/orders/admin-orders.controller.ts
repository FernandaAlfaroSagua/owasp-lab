import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { OrdersService } from './orders.service';

@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminOrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  findAll() {
    return this.orders.findAllAdmin();
  }
}
