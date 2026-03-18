import type {
  ChartDatum,
  DashboardComputation,
  DashboardFilters,
  DashboardInsight,
  FinanceTransaction,
  SummaryCardMetric,
} from "@/types/dashboard";

function parseDate(date: string) {
  return new Date(`${date}T12:00:00`);
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getRangeLength(dateRange: DashboardFilters["dateRange"]) {
  switch (dateRange) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "180d":
      return 180;
    case "90d":
    default:
      return 90;
  }
}

function getAnchorDate(transactions: FinanceTransaction[]) {
  const latest = transactions.reduce((current, transaction) => {
    return transaction.date > current ? transaction.date : current;
  }, transactions[0]?.date ?? new Date().toISOString().slice(0, 10));

  return parseDate(latest);
}

function getRangeBounds(
  transactions: FinanceTransaction[],
  dateRange: DashboardFilters["dateRange"],
) {
  const rangeLength = getRangeLength(dateRange);
  const end = getAnchorDate(transactions);
  const start = addDays(end, -(rangeLength - 1));

  return { start, end, rangeLength };
}

function inRange(date: string, start: Date, end: Date) {
  const current = parseDate(date);
  return current >= start && current <= end;
}

function compareTransactions(
  left: FinanceTransaction,
  right: FinanceTransaction,
  sortBy: DashboardFilters["sortBy"],
) {
  switch (sortBy) {
    case "date-asc":
      return left.date.localeCompare(right.date);
    case "amount-desc":
      return right.amount - left.amount;
    case "amount-asc":
      return left.amount - right.amount;
    case "name-asc":
      return left.counterparty.localeCompare(right.counterparty);
    case "date-desc":
    default:
      return right.date.localeCompare(left.date);
  }
}

function calculateSignedAmount(transaction: FinanceTransaction) {
  return transaction.type === "income" ? transaction.amount : -transaction.amount;
}

function percentageChange(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
}

function buildSummary(
  transactions: FinanceTransaction[],
  previousTransactions: FinanceTransaction[],
): SummaryCardMetric[] {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const previousIncome = previousTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const previousExpenses = previousTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const netMargin = totalIncome === 0 ? 0 : ((totalIncome - totalExpenses) / totalIncome) * 100;
  const previousNetMargin =
    previousIncome === 0
      ? 0
      : ((previousIncome - previousExpenses) / previousIncome) * 100;

  const averageTransaction =
    transactions.length === 0
      ? 0
      : transactions.reduce((sum, transaction) => sum + transaction.amount, 0) /
        transactions.length;

  const previousAverage =
    previousTransactions.length === 0
      ? 0
      : previousTransactions.reduce((sum, transaction) => sum + transaction.amount, 0) /
        previousTransactions.length;

  return [
    {
      id: "income",
      label: "Income",
      value: totalIncome,
      change: percentageChange(totalIncome, previousIncome),
      format: "currency",
    },
    {
      id: "expenses",
      label: "Expenses",
      value: totalExpenses,
      change: percentageChange(totalExpenses, previousExpenses),
      format: "currency",
    },
    {
      id: "margin",
      label: "Net margin",
      value: netMargin,
      change: netMargin - previousNetMargin,
      format: "percent",
    },
    {
      id: "avg",
      label: "Avg transaction",
      value: averageTransaction,
      change: percentageChange(averageTransaction, previousAverage),
      format: "currency",
    },
  ];
}

function buildLineSeries(
  transactions: FinanceTransaction[],
  start: Date,
  rangeLength: number,
): ChartDatum[] {
  const daily = new Map<string, { income: number; expense: number }>();

  for (const transaction of transactions) {
    const existing = daily.get(transaction.date) ?? { income: 0, expense: 0 };

    if (transaction.type === "income") {
      existing.income += transaction.amount;
    } else {
      existing.expense += transaction.amount;
    }

    daily.set(transaction.date, existing);
  }

  return Array.from({ length: rangeLength }, (_, index) => {
    const key = toDateKey(addDays(start, index));
    const snapshot = daily.get(key) ?? { income: 0, expense: 0 };

    return {
      label: key,
      value: snapshot.income,
      secondaryValue: snapshot.expense,
    };
  });
}

function groupExpensesByCategory(transactions: FinanceTransaction[]) {
  const grouped = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type !== "expense") {
      continue;
    }

    grouped.set(
      transaction.category,
      (grouped.get(transaction.category) ?? 0) + transaction.amount,
    );
  }

  return Array.from(grouped.entries())
    .sort((left, right) => right[1] - left[1])
    .map(([label, value]) => ({ label, value }));
}

function buildInsight(
  summary: SummaryCardMetric[],
  barSeries: ChartDatum[],
  transactions: FinanceTransaction[],
): DashboardInsight {
  const topCategory = barSeries[0];
  const netMetric = summary.find((metric) => metric.id === "margin");
  const newestTransaction = transactions[0];

  if (!topCategory || !netMetric || !newestTransaction) {
    return {
      title: "No signals yet",
      description: "Adjust the filters or expand the date range to reveal more activity.",
    };
  }

  return {
    title: `${topCategory.label} is the main spend driver`,
    description: `${topCategory.label} accounts for the biggest expense load while net margin sits at ${netMetric.value.toFixed(
      1,
    )}%. Latest movement came from ${newestTransaction.counterparty}.`,
  };
}

export function buildDashboardComputation(
  transactions: FinanceTransaction[],
  filters: DashboardFilters,
  livePulse: DashboardComputation["livePulse"],
): DashboardComputation {
  if (transactions.length === 0) {
    return {
      transactions: [],
      categories: [],
      summary: [],
      lineSeries: [],
      barSeries: [],
      pieSeries: [],
      insight: {
        title: "No data loaded",
        description: "The dashboard has not received any mock transactions yet.",
      },
      livePulse,
    };
  }

  const { start, end, rangeLength } = getRangeBounds(transactions, filters.dateRange);
  const previousEnd = addDays(start, -1);
  const previousStart = addDays(previousEnd, -(rangeLength - 1));
  const normalizedSearch = filters.search.trim().toLowerCase();

  const filteredTransactions = transactions
    .filter((transaction) => inRange(transaction.date, start, end))
    .filter((transaction) =>
      filters.category === "All" ? true : transaction.category === filters.category,
    )
    .filter((transaction) => {
      if (!normalizedSearch) {
        return true;
      }

      return [
        transaction.category,
        transaction.counterparty,
        transaction.channel,
        transaction.note,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    })
    .sort((left, right) => compareTransactions(left, right, filters.sortBy));

  const previousTransactions = transactions.filter((transaction) =>
    inRange(transaction.date, previousStart, previousEnd),
  );

  const categories = Array.from(new Set(transactions.map((transaction) => transaction.category)))
    .sort((left, right) => left.localeCompare(right));

  const summary = buildSummary(filteredTransactions, previousTransactions);
  const lineSeries = buildLineSeries(filteredTransactions, start, rangeLength);
  const barSeries = groupExpensesByCategory(filteredTransactions);
  const pieSeries = barSeries.slice(0, 6);
  const sortedByDate = filteredTransactions
    .slice()
    .sort((left, right) => right.date.localeCompare(left.date));

  return {
    transactions: filteredTransactions,
    categories,
    summary,
    lineSeries,
    barSeries,
    pieSeries,
    insight: buildInsight(summary, barSeries, sortedByDate),
    livePulse,
  };
}

export function getTransactionNetAmount(transaction: FinanceTransaction) {
  return calculateSignedAmount(transaction);
}
