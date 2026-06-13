import { loadFinanceTransactions } from "@/lib/finance-data";
import type { FinanceTransaction } from "@/types/dashboard";

interface TransactionsApiResponse {
  data?: unknown;
  error?: unknown;
}

function normalizeBasePath(basePath: string | undefined) {
  const trimmed = basePath?.trim().replace(/^\/+|\/+$/g, "") ?? "";
  return trimmed ? `/${trimmed}` : "";
}

function getTransactionsUrl() {
  return `${normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH)}/api/transactions`;
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

async function readJsonResponse(response: Response): Promise<TransactionsApiResponse> {
  try {
    return (await response.json()) as TransactionsApiResponse;
  } catch {
    throw new Error("Transactions API returned an invalid JSON response.");
  }
}

export async function fetchFinanceTransactions(
  signal?: AbortSignal,
): Promise<FinanceTransaction[]> {
  try {
    const response = await fetch(getTransactionsUrl(), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      signal,
    });
    const payload = await readJsonResponse(response);

    if (!response.ok) {
      throw new Error(
        typeof payload.error === "string"
          ? payload.error
          : `Transactions API failed with status ${response.status}.`,
      );
    }

    return loadFinanceTransactions(payload.data);
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }

    throw error instanceof Error
      ? error
      : new Error("The transactions API request failed.");
  }
}

export { isAbortError };
