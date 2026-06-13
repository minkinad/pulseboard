export function LoadingState() {
  return (
    <section className="grid grid-cols-12 gap-4">
      {["summary", "cashflow", "categories", "activity"].map((item, index) => (
        <div
          key={item}
          className={
            index === 0
              ? "col-span-12 min-h-[300px]"
              : "col-span-12 min-h-[320px] lg:col-span-6"
          }
        >
          <div className="surface-panel h-full p-5">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
            <div className="mt-5 h-8 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="h-24 animate-pulse rounded-md bg-slate-100" />
              <div className="h-24 animate-pulse rounded-md bg-slate-100" />
            </div>
            <div className="mt-4 h-32 animate-pulse rounded-md bg-slate-100" />
          </div>
        </div>
      ))}
    </section>
  );
}
