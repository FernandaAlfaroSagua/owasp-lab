import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser, JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.orders.findAllForUser(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.orders.findOne(id, user);
  }

  @Post()
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: AuthUser) {
    return this.orders.create(dto, user);
  }
}
