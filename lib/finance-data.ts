import rawFinanceData from "@/data/finance-data.json";
import { formatDateKey, parseIsoDate } from "@/lib/date";
import type { DashboardComputation, FinanceTransaction } from "@/types/dashboard";

const transactionTypes = new Set<FinanceTransaction["type"]>(["income", "expense"]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readStringField(
  transaction: Record<string, unknown>,
  fieldName: keyof FinanceTransaction,
  index: number,
) {
  const value = transaction[fieldName];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Transaction ${index + 1} has an invalid "${fieldName}" field.`);
  }

  return value.trim();
}

function readAmountField(transaction: Record<string, unknown>, index: number) {
  const value = transaction.amount;

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Transaction ${index + 1} has an invalid "amount" field.`);
  }

  return value;
}

function readDateField(transaction: Record<string, unknown>, index: number) {
  const value = readStringField(transaction, "date", index);
  const parsed = parseIsoDate(value);

  if (!parsed) {
    throw new Error(`Transaction ${index + 1} has an invalid "date" field.`);
  }

  return formatDateKey(parsed);
}

function parseTransaction(transaction: unknown, index: number): FinanceTransaction {
  if (!isObject(transaction)) {
    throw new Error(`Transaction ${index + 1} is not an object.`);
  }

  const type = readStringField(transaction, "type", index);

  if (!transactionTypes.has(type as FinanceTransaction["type"])) {
    throw new Error(`Transaction ${index + 1} has an unknown "type" value.`);
  }

  const normalizedType = type as FinanceTransaction["type"];

  return {
    id: readStringField(transaction, "id", index),
    date: readDateField(transaction, index),
    type: normalizedType,
    category: readStringField(transaction, "category", index),
    counterparty: readStringField(transaction, "counterparty", index),
    channel: readStringField(transaction, "channel", index),
    note: readStringField(transaction, "note", index),
    amount: readAmountField(transaction, index),
  };
}

export function loadFinanceTransactions(source: unknown = rawFinanceData) {
  if (!Array.isArray(source)) {
    throw new Error("Finance dataset must be an array of transactions.");
  }

  const seenIds = new Set<string>();

  return source.map(parseTransaction).map((transaction, index) => {
    if (seenIds.has(transaction.id)) {
      throw new Error(`Transaction ${index + 1} reuses the id "${transaction.id}".`);
    }

    seenIds.add(transaction.id);
    return transaction;
  });
}

export function createLivePulse(): DashboardComputation["livePulse"] {
  return {
    activeStreams: 112,
    variance: 2.4,
    syncedAt: new Date().toISOString(),
  };
}

export function evolveLivePulse(
  current: DashboardComputation["livePulse"],
): DashboardComputation["livePulse"] {
  const drift = (Math.random() * 10 - 5) / 10;
  const streamDelta = Math.round(Math.random() * 8 - 3);

  return {
    activeStreams: Math.max(86, current.activeStreams + streamDelta),
    variance: Number((Math.max(-4.8, Math.min(8.2, current.variance + drift))).toFixed(1)),
    syncedAt: new Date().toISOString(),
  };
}
