export function DashboardSkeleton() {
  return (
    <section className="grid grid-cols-12 gap-4">
      <div className="col-span-12 h-[260px] animate-pulse rounded-[30px] bg-card/70" />
      <div className="col-span-12 xl:col-span-8 h-[380px] animate-pulse rounded-[30px] bg-card/70" />
      <div className="col-span-12 md:col-span-6 xl:col-span-4 h-[380px] animate-pulse rounded-[30px] bg-card/70" />
      <div className="col-span-12 md:col-span-6 xl:col-span-6 h-[360px] animate-pulse rounded-[30px] bg-card/70" />
      <div className="col-span-12 xl:col-span-6 h-[360px] animate-pulse rounded-[30px] bg-card/70" />
    </section>
  );
}
