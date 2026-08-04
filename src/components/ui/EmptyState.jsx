import { Inbox } from "lucide-react";

/** Shown when a list/table has no data. */
export default function EmptyState({ title = "Nothing here yet", message, icon: Icon = Inbox, children }) {
  return (
    <div className="card flex flex-col items-center gap-2 p-10 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.04] text-ink-faint">
        <Icon size={22} />
      </span>
      <p className="text-sm font-semibold">{title}</p>
      {message && <p className="max-w-sm text-xs text-ink-dim">{message}</p>}
      {children}
    </div>
  );
}
