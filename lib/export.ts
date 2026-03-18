import type { FinanceTransaction } from "@/types/dashboard";

export function downloadTransactionsCsv(transactions: FinanceTransaction[]) {
  const headers = [
    "id",
    "date",
    "type",
    "category",
    "counterparty",
    "channel",
    "note",
    "amount",
  ];

  const lines = transactions.map((transaction) =>
    [
      transaction.id,
      transaction.date,
      transaction.type,
      transaction.category,
      transaction.counterparty,
      transaction.channel,
      transaction.note,
      String(transaction.amount),
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(","),
  );

  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "pulseboard-transactions.csv";
  link.click();
  URL.revokeObjectURL(url);
}
