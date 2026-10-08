import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { numericTransformer } from '../common/numeric.transformer';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, transformer: numericTransformer })
  price: number;

  @Column()
  category: string;
}
