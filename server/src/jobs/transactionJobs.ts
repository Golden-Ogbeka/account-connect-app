import db, { sql } from '../db';
import { postTransactionService } from '../services/transactionService';
import logger from '../utils/logger';

// NOTE: SQLite persistence is used here as a development solution to survive server restarts.
// In production, replace with a persistent job queue (e.g. BullMQ with Redis).

const PENDING_TO_POSTED_DELAY_MS = 2 * 60 * 1000;

interface ScheduledJob {
  id: string;
  transaction_id: string;
  scheduled_at: number;
}

const runJob = async (transactionId: string): Promise<void> => {
  try {
    await postTransactionService(transactionId);
    await db.query(sql`DELETE FROM jobs WHERE transaction_id = ${transactionId}`);
    logger.info(`Transaction ${transactionId} posted successfully.`);
  } catch (error) {
    logger.error(
      `Failed to post transaction ${transactionId}: ${error instanceof Error ? error.stack : error}`,
    );
  }
};

export const schedulePostTransactionJob = async (transactionId: string): Promise<void> => {
  await db.query(
    sql`INSERT OR IGNORE INTO jobs (id, transaction_id, scheduled_at) VALUES (${transactionId}, ${transactionId}, ${Date.now()})`,
  );
  setTimeout(() => void runJob(transactionId), PENDING_TO_POSTED_DELAY_MS);
  logger.info(`Transaction ${transactionId} scheduled to post in 2 minutes.`);
};

export const recoverJobs = async (): Promise<void> => {
  const jobs = (await db.query(sql`SELECT * FROM jobs`)) as ScheduledJob[];
  if (jobs.length === 0) return;

  logger.info(`Recovering ${jobs.length} pending job(s) from previous session.`);

  jobs.forEach(({ transaction_id, scheduled_at }) => {
    const remaining = PENDING_TO_POSTED_DELAY_MS - (Date.now() - scheduled_at);
    if (remaining <= 0) {
      void runJob(transaction_id);
    } else {
      setTimeout(() => void runJob(transaction_id), remaining);
      logger.info(`Transaction ${transaction_id} rescheduled to post in ${Math.round(remaining / 1000)}s.`);
    }
  });
};
