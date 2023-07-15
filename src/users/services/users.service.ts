import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

import { User } from '../models';
import { PG_CONNECTION } from '../../constants';

@Injectable()
export class UsersService {
  private usersTableName = process.env.USERS_TABLE_NAME;

  constructor(@Inject(PG_CONNECTION) private pool: Pool) {}

  async findOne(name: string): Promise<User> {
    const { rows } = await this.pool.query(
      `SELECT * from ${this.usersTableName}`,
    );
    return rows.find((item) => name === item.name);
  }

  async createOne({ name, password }: User): Promise<User> {
    const result = await this.pool.query({
      text: `INSERT INTO ${this.usersTableName} (name, password) VALUES($1, $2) RETURNING id, name, email, password`,
      values: [name, password],
    });
    const { password: _, ...created }: User = result.rows[0];
    return created;
  }
}
