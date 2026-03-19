export function DashboardSkeleton() {
  return (
    <section className="grid grid-cols-12 gap-5">
      <div className="col-span-12 h-[260px] animate-pulse rounded-2xl border border-stroke bg-slate-50" />
      <div className="col-span-12 h-[380px] animate-pulse rounded-2xl border border-stroke bg-slate-50 xl:col-span-8" />
      <div className="col-span-12 h-[380px] animate-pulse rounded-2xl border border-stroke bg-slate-50 md:col-span-6 xl:col-span-4" />
      <div className="col-span-12 h-[360px] animate-pulse rounded-2xl border border-stroke bg-slate-50 md:col-span-6 xl:col-span-6" />
      <div className="col-span-12 h-[360px] animate-pulse rounded-2xl border border-stroke bg-slate-50 xl:col-span-6" />
    </section>
  );
}
