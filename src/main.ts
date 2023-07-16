import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import helmet from 'helmet';

import { AppModule } from './app.module';

let server: Handler;

const port = process.env.PORT || 4000;

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  await app.listen(port);
  console.log('App is running on %s port', port);
}

export async function bootstrapServerless(): Promise<Handler> {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrapServerless());
  return server(event, context, callback);
};

bootstrap();
