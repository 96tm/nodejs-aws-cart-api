import { Duration } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export const SHARED_LAMBDA_PROPS: Omit<
  lambda.FunctionProps,
  'code' | 'handler'
> = {
  runtime: lambda.Runtime.NODEJS_18_X,
  memorySize: 1024,
  timeout: Duration.seconds(5),
};
