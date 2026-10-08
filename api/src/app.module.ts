import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'lab',
      password: process.env.DB_PASSWORD ?? 'lab_dev_password',
      database: process.env.DB_NAME ?? 'owasp_lab',
      autoLoadEntities: true,
      // Lab only: the schema is created from the entities. Use migrations in a real app.
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    SeedModule,
  ],
})
export class AppModule {}
