import { Column } from "typeorm/decorator/columns/Column";
import { PrimaryGeneratedColumn } from "typeorm/decorator/columns/PrimaryGeneratedColumn";
import { Entity } from "typeorm/decorator/entity/Entity";

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string; // 'cart-wise', 'product-wise', 'BxGy', etc.

  @Column({ type: 'jsonb', default: {} })
details!: {
  type?: 'cart-wise' | 'product-wise' | 'bxgy';
  threshold?: number;
  discount?: number;
  productId?: number;
  buyProducts?: { productId: number; quantity: number }[];
  getProducts?: { productId: number; quantity: number }[];
  repetitionLimit?: number;
};


  @Column({ type: 'jsonb', default: {} })
  conditions!: {
    applicableProducts?: { productId: number; discount: number }[];
    minCartValue?: number;
    expiryDate?: Date;
    customerGroups?: string[];
  };

  @Column({ type: 'boolean', default: true })
  isActive!: boolean; // To easily enable/disable a coupon
}
