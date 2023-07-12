declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PRODUCT_AWS_REGION: string;
      POSTGRES_PORT: string;
      POSTGRES_NAME: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_HOST: string;
      POSTGRES_DB: string;
      CARTS_TABLE_NAME: string;
      CART_ITEMS_TABLE_NAME: string;
      USERS_TABLE_NAME: string;
      ORDERS_TABLE_NAME: string;
      PRODUCTS_TABLE_NAME: string;
      AUTH_USER_NAME: string;
      AUTH_USER_PASSWORD: string;
    }
  }
}

export {};
