import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section className="surface-panel flex min-h-[420px] flex-col items-center justify-center px-6 py-10 text-center">
      <span className="rounded-3xl border border-danger/20 bg-danger/10 p-4 text-danger">
        <AlertTriangle className="h-8 w-8" />
      </span>
      <h2 className="mt-5 text-2xl font-semibold">Dashboard data hit a snag</h2>
      <p className="mt-3 max-w-lg text-sm text-foreground/70">{message}</p>
      <button type="button" className="control-base mt-6" onClick={onRetry}>
        <RefreshCcw className="h-4 w-4" />
        Retry load
      </button>
    </section>
  );
}
