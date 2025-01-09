// import pg, { QueryArrayConfig, QueryConfig } from "pg";
// import { Pool as PgPool, PoolConfig } from "pg";

import pg, {
  Pool as PgPool,
  PoolConfig,
  QueryConfig,
  QueryArrayConfig,
} from "pg";

class Pool {
  _pool: PgPool | null = null;

  connect(options: PoolConfig) {
    this._pool = new pg.Pool(options);
    // Creating a Pool doesn't mean the database is connected. That's why we connect using the 'query'.
    return this._pool.query("SELECT 1+1");
  }

  close() {
    this._pool?.end();
  }

  query(sql: string | QueryConfig | QueryArrayConfig, params: string[] = []) {
    if (!this._pool) {
      throw new Error("Pool NOT connected");
    }
    return this._pool?.query(sql, params);
  }

  get info() {
    return this._pool;
  }
}

export default new Pool();
