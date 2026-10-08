import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { numericTransformer } from '../common/numeric.transformer';

export type OrderStatus = 'pending' | 'paid' | 'shipped';

export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'jsonb' })
  items: OrderItem[];

  @Column({ type: 'numeric', precision: 10, scale: 2, transformer: numericTransformer })
  total: number;

  @Column({ type: 'varchar', default: 'pending' })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;
}
