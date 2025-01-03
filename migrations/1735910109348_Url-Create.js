/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.sql(
    `
            CREATE TYPE timevalue AS (
                timestamp TIMESTAMP
            );

            CREATE TABLE url (
                short_url VARCHAR(20) PRIMARY KEY NOT NULL UNIQUE,
                redirect_url VARCHAR(100) NOT NULL,
                visited_history timevalue[],
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql(`
        DROP TYPE IF EXISTS timevalue;
        DROP TABLE IF EXISTS url;
    `);
};
