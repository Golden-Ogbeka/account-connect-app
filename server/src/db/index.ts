import bcrypt from 'bcryptjs';
import connect, { sql } from '@databases/sqlite';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

const dbPath = path.join(process.cwd(), 'src', 'db', 'app.db');
const db = connect(dbPath);

export { sql };

export const initDb = async (): Promise<void> => {
  await db.query(sql`PRAGMA foreign_keys = ON`);
  await db.query(sql`PRAGMA journal_mode = WAL`);

  await db.query(sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await db.query(sql`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      account_number TEXT NOT NULL UNIQUE,
      account_name TEXT NOT NULL,
      balance INTEGER NOT NULL DEFAULT 0,
      address TEXT,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  await db.query(sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      merchant TEXT NOT NULL,
      amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      idempotency_key TEXT NOT NULL,
      date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (account_id) REFERENCES accounts(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(idempotency_key, user_id)
    )
  `);

  await db.query(sql`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL UNIQUE,
      scheduled_at INTEGER NOT NULL
    )
  `);

  await db.query(sql`
    CREATE TABLE IF NOT EXISTS connections (
      id TEXT PRIMARY KEY,
      follower_id TEXT NOT NULL,
      following_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (follower_id) REFERENCES users(id),
      FOREIGN KEY (following_id) REFERENCES users(id),
      UNIQUE(follower_id, following_id)
    )
  `);

  await seedDb();
  logger.info('Database initialised.');
};

const seedDb = async (): Promise<void> => {
  const rows = await db.query(sql`SELECT COUNT(*) as count FROM users`);
  if ((rows[0] as { count: number }).count > 0) return;

  const users = [
    { id: uuidv4(), name: 'Adaeze Okonkwo', email: 'adaeze@connect.ng', password: 'password123' },
    { id: uuidv4(), name: 'Emeka Nwosu', email: 'emeka@connect.ng', password: 'password123' },
    { id: uuidv4(), name: 'Fatima Bello', email: 'fatima@connect.ng', password: 'password123' },
    { id: uuidv4(), name: 'Chidi Okeke', email: 'chidi@connect.ng', password: 'password123' },
    { id: uuidv4(), name: 'Ngozi Eze', email: 'ngozi@connect.ng', password: 'password123' },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await db.query(
      sql`INSERT INTO users (id, name, email, password) VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})`,
    );
    const accountId = uuidv4();
    const accountNumber = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
    const balance = Math.floor(Math.random() * 500000) * 100;
    await db.query(
      sql`INSERT INTO accounts (id, user_id, account_number, account_name, balance, address, description)
          VALUES (${accountId}, ${user.id}, ${accountNumber}, ${user.name}, ${balance}, ${'Lagos, Nigeria'}, ${'Personal account'})`,
    );
  }

  logger.info('Database seeded with 5 users.');
};

export default db;
