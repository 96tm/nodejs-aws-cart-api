import { Module, forwardRef } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { DbModule } from '../db/db.module';

@Module({
  imports: [forwardRef(() => OrderModule), DbModule],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
