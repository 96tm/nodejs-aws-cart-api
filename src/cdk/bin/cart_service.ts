import * as cdk from 'aws-cdk-lib';
import { CartServiceStack } from '../lib/cart_service_stack';

const app = new cdk.App();
new CartServiceStack(app, 'CartServiceStack');
