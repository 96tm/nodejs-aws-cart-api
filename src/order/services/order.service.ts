import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Pool } from 'pg';

import { Order, OrderCreateDTO, OrderStatus, OrderUpdateDTO } from '../models';
import { PG_CONNECTION } from '../../constants';
import { CartService } from '../../cart/services/cart.service';

@Injectable()
export class OrderService {
  private ordersTableName = process.env.ORDERS_TABLE_NAME;
  private cartItemsTableName = process.env.CART_ITEMS_TABLE_NAME;
  private productsTableName = process.env.PRODUCTS_TABLE_NAME;

  constructor(
    @Inject(PG_CONNECTION) private pool: Pool,
    @Inject(forwardRef(() => CartService))
    private cartService: CartService,
  ) {}

  async findById(orderId: string): Promise<Order> {
    const result = await this.pool.query({
      text: `SELECT 
          orders.id, orders.user_id, orders.cart_id,
          orders.payment, orders.delivery, orders.comments,
          orders.status, orders.total,
          COALESCE(array_agg(
            json_build_object(
               'cart_id', cart_items.cart_id,
               'product_id', cart_items.product_id,
               'count', cart_items.count,
               'product', json_build_object(
                 'price', products.price,
                 'title', products.title,
                 'description', products.description,
                 'id', products.id
               )
             ) 
          ) FILTER (WHERE cart_items.product_id IS NOT NULL), '{}') AS items
          FROM ${this.ordersTableName} AS orders
          LEFT JOIN ${this.cartItemsTableName} AS cart_items
          ON orders.cart_id=cart_items.cart_id
          LEFT JOIN ${this.productsTableName} AS products
          ON cart_items.product_id=products.id
          WHERE orders.id=$1
          GROUP BY orders.id`,
      values: [orderId],
    });
    console.log(result.rows);
    return result.rows[0];
  }

  async create({
    userId,
    cartId,
    total,
    delivery,
    payment,
    comments,
    items,
  }: OrderCreateDTO) {
    this.pool.query('BEGIN');
    const result = await this.pool.query({
      text: `
        INSERT INTO ${this.ordersTableName}
        (user_id, cart_id, status, total, delivery, payment, comments)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, user_id, cart_id, status, total, delivery, payment, comments`,
      values: [
        userId,
        cartId,
        OrderStatus.InProgress,
        total,
        delivery,
        payment,
        comments,
      ],
    });
    this.cartService.removeByUserId(userId);
    this.pool.query('COMMIT');
    const order = result.rows[0];
    console.log(order);
    const returned: Order = {
      ...order,
      items,
    };
    return returned;
  }

  async update(orderId: string, data: OrderUpdateDTO): Promise<Order> {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }
    const updateExpressions = Object.entries(data)
      .reduce((acc, [key, value]) => acc.concat([`${key}='${value}'`]), [])
      .join(', ');
    if (updateExpressions) {
      console.log(
        'exp',
        `UPDATE ${this.ordersTableName} SET ${updateExpressions} WHERE id=$1 RETURNING *`,
      );
      const result = await this.pool.query(
        `UPDATE ${this.ordersTableName} SET ${updateExpressions} WHERE id=$1 RETURNING *`,
        [orderId],
      );
      const row = result.rows[0];
      return {
        ...order,
        ...row,
      };
    }
    return order;
  }
}
