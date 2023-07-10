import { Construct } from 'constructs';
import { Code, Function } from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

import path from 'path';
import { SHARED_LAMBDA_PROPS } from '../utils/constants';

export class CartService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const backendLambda = new Function(this, 'BackendHandler', {
      ...SHARED_LAMBDA_PROPS,
      code: Code.fromAsset(path.resolve(__dirname, '..', '..', '..', 'dist')),
      handler: 'main.handler',
      environment: {
        NODE_PATH: '$NODE_PATH:/opt',
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
