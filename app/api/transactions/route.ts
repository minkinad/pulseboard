import { NextResponse } from "next/server";

import { loadFinanceTransactions } from "@/lib/finance-data";

export const dynamic = "force-static";

export function GET() {
  try {
    return NextResponse.json({
      data: loadFinanceTransactions(),
      meta: {
        source: "mock-finance-data",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The finance dataset could not be loaded.",
      },
      { status: 500 },
    );
  }
}
