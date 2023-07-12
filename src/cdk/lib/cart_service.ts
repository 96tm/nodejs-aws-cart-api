import { Construct } from 'constructs';
import { Code, Function } from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

import path from 'path';
import { ConfigModule } from '@nestjs/config';
import { SHARED_LAMBDA_PROPS } from '../utils/constants';

ConfigModule.forRoot();

export class CartService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const backendLambda = new Function(this, 'BackendHandler', {
      ...SHARED_LAMBDA_PROPS,
      code: Code.fromAsset(path.resolve(__dirname, '..', '..', '..', 'dist')),
      handler: 'main.handler',
      environment: {
        NODE_PATH: '$NODE_PATH:/opt',
        PRODUCT_AWS_REGION: process.env.PRODUCT_AWS_REGION,
        POSTGRES_NAME: process.env.POSTGRES_NAME,
        POSTGRES_DB: process.env.POSTGRES_DB,
        POSTGRES_USER: process.env.POSTGRES_USER,
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
        POSTGRES_HOST: process.env.POSTGRES_HOST,
        POSTGRES_PORT: process.env.POSTGRES_PORT,
        CARTS_TABLE_NAME: process.env.CARTS_TABLE_NAME,
        CART_ITEMS_TABLE_NAME: process.env.CART_ITEMS_TABLE_NAME,
        ORDERS_TABLE_NAME: process.env.ORDERS_TABLE_NAME,
        PRODUCTS_TABLE_NAME: process.env.PRODUCTS_TABLE_NAME,
        USERS_TABLE_NAME: process.env.USERS_TABLE_NAME,
        AUTH_USER_NAME: process.env.AUTH_USER_NAME,
        AUTH_USER_PASSWORD: process.env.AUTH_USER_PASSWORD,
      },
    });

    const api = new LambdaRestApi(this, 'cart-api', {
      handler: backendLambda,
      description: 'CartService REST API',
      deployOptions: {
        stageName: 'dev',
      },
      defaultCorsPreflightOptions: {
        allowHeaders: ['*'],
        allowOrigins: ['*'],
        allowMethods: ['GET', 'POST', 'PUT', 'PATCH'],
      },
    });
  }
}
