import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './services';
import { DbModule } from '../db/db.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [forwardRef(() => CartModule), DbModule],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
