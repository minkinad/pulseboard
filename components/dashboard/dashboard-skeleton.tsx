export function DashboardSkeleton() {
  return (
    <section className="grid grid-cols-12 gap-5">
      <div className="col-span-12 h-[260px] animate-pulse rounded-[24px] border border-stroke/60 bg-card/70" />
      <div className="col-span-12 h-[380px] animate-pulse rounded-[24px] border border-stroke/60 bg-card/70 xl:col-span-8" />
      <div className="col-span-12 h-[380px] animate-pulse rounded-[24px] border border-stroke/60 bg-card/70 md:col-span-6 xl:col-span-4" />
      <div className="col-span-12 h-[360px] animate-pulse rounded-[24px] border border-stroke/60 bg-card/70 md:col-span-6 xl:col-span-6" />
      <div className="col-span-12 h-[360px] animate-pulse rounded-[24px] border border-stroke/60 bg-card/70 xl:col-span-6" />
    </section>
  );
}
