import { CloudAlert, RotateCw } from "lucide-react";

/** Shown when a data fetch fails. */
export default function ErrorState({ message = "Something went wrong while loading data.", onRetry }) {
  return (
    <div className="card flex flex-col items-center gap-3 border-crit/20 p-10 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-crit/10 text-crit">
        <CloudAlert size={22} />
      </span>
      <p className="text-sm font-semibold">Unable to load</p>
      <p className="max-w-sm text-xs text-ink-dim">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 flex items-center gap-1.5 rounded-lg border border-line bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-white/[0.06]"
        >
          <RotateCw size={13} /> Try again
        </button>
      )}
    </div>
  );
}
