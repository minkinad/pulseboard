import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { WidgetEmptyState } from "@/components/dashboard/widget-empty-state";
import {
  formatCurrency,
  formatDateWithYear,
  formatSignedCurrency,
} from "@/lib/format";
import { getTransactionNetAmount } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";
import type { FinanceTransaction } from "@/types/dashboard";

interface TransactionsWidgetProps {
  transactions: FinanceTransaction[];
}

export function TransactionsWidget({ transactions }: TransactionsWidgetProps) {
  if (transactions.length === 0) {
    return (
      <WidgetEmptyState
        title="No matching transactions"
        description="Search terms or filters removed every transaction from this slice."
      />
    );
  }

  return (
    <div className="h-full min-h-0 overflow-hidden rounded-md border border-stroke bg-white">
      <div className="h-full overflow-auto">
        <div className="min-w-[680px]">
          <div className="sticky top-0 z-10 grid grid-cols-[1.35fr_0.85fr_0.9fr_0.8fr] gap-4 border-b border-stroke bg-slate-50/95 px-4 py-3 font-mono text-[11px] uppercase text-slate-500 backdrop-blur">
            <span>Counterparty</span>
            <span>Category</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
          </div>
          {transactions.slice(0, 10).map((transaction) => {
            const incoming = transaction.type === "income";
            const amount = getTransactionNetAmount(transaction);

            return (
              <div
                key={transaction.id}
                className="grid grid-cols-[1.35fr_0.85fr_0.9fr_0.8fr] gap-4 border-b border-stroke px-4 py-3 text-sm transition hover:bg-slate-50/70 last:border-b-0"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={cn(
                      "mt-1 shrink-0 rounded-md border p-2",
                      incoming
                        ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                        : "border-red-200 bg-red-50 text-red-600",
                    )}
                  >
                    {incoming ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">
                      {transaction.counterparty}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                      {transaction.note}
                    </p>
                  </div>
                </div>
                <div className="truncate pt-1 text-slate-600">{transaction.category}</div>
                <div className="pt-1 font-mono text-[12px] text-slate-600">
                  {formatDateWithYear(transaction.date)}
                </div>
                <div className="pt-1 text-right">
                  <p className={cn("font-semibold", incoming ? "text-emerald-600" : "text-red-600")}>
                    {formatSignedCurrency(amount)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Gross {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
