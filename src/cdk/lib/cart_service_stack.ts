import * as cdk from 'aws-cdk-lib';

import { CartService } from './cart_service';

export class CartServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CartService(this, 'CartService');
  }
}
