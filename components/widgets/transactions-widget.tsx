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
    <div className="h-full overflow-hidden rounded-[26px] border border-stroke/15 bg-surface/55">
      <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_0.8fr] gap-4 border-b border-stroke/15 px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground/50">
        <span>Counterparty</span>
        <span>Category</span>
        <span>Date</span>
        <span className="text-right">Amount</span>
      </div>
      <div className="max-h-[340px] overflow-y-auto">
        {transactions.slice(0, 10).map((transaction) => {
          const incoming = transaction.type === "income";
          const amount = getTransactionNetAmount(transaction);

          return (
            <div
              key={transaction.id}
              className="grid grid-cols-[1.4fr_0.8fr_0.9fr_0.8fr] gap-4 border-b border-stroke/10 px-5 py-4 text-sm last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-1 rounded-2xl p-2",
                    incoming ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
                  )}
                >
                  {incoming ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4" />
                  )}
                </span>
                <div>
                  <p className="font-semibold">{transaction.counterparty}</p>
                  <p className="mt-1 text-xs text-foreground/60">{transaction.note}</p>
                </div>
              </div>
              <div className="pt-1 text-foreground/70">{transaction.category}</div>
              <div className="pt-1 text-foreground/70">{formatDateWithYear(transaction.date)}</div>
              <div className="pt-1 text-right">
                <p className={cn("font-semibold", incoming ? "text-success" : "text-danger")}>
                  {formatSignedCurrency(amount)}
                </p>
                <p className="mt-1 text-xs text-foreground/50">
                  Gross {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
