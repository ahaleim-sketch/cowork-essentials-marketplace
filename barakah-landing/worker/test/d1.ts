// Minimal D1 stand-in on node:sqlite, using the real migration, so the SQL is actually executed.
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

export function makeD1(opts: { failBatch?: boolean } = {}) {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../migrations/0001_init.sql', import.meta.url), 'utf8'));
  const stmt = (sql: string, params: unknown[] = []) => ({
    sql,
    params,
    bind: (...p: unknown[]) => stmt(sql, p),
    run: async () => (sqlite.prepare(sql).run(...(params as never[])), { success: true }),
    all: async () => ({ results: sqlite.prepare(sql).all(...(params as never[])) })
  });
  const db = {
    sqlite,
    prepare: (sql: string) => stmt(sql),
    batch: async (stmts: ReturnType<typeof stmt>[]) => {
      if (opts.failBatch) throw new Error('D1 down');
      sqlite.exec('BEGIN');
      try {
        for (const s of stmts) sqlite.prepare(s.sql).run(...(s.params as never[]));
        sqlite.exec('COMMIT');
      } catch (e) {
        sqlite.exec('ROLLBACK');
        throw e;
      }
      return [];
    }
  };
  return db;
}
