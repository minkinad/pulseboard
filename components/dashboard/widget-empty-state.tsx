import { Inbox } from "lucide-react";

export function WidgetEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-[22px] border border-dashed border-stroke/65 bg-card/48 px-6 text-center">
      <span className="rounded-2xl border border-stroke/60 bg-card/82 p-3 text-accent">
        <Inbox className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-foreground/65">{description}</p>
    </div>
  );
}
