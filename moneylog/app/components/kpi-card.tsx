import { formatKrw } from "@/lib/format";

type Props = {
  title: string;
  value: number;
  tone?: "neutral" | "positive" | "negative";
};

export function KpiCard({ title, value, tone = "neutral" }: Props) {
  return (
    <article className="card">
      <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{title}</p>
      <p
        className={`mt-2 text-2xl font-semibold ${
          tone === "positive"
            ? "text-emerald-700"
            : tone === "negative"
              ? "text-rose-700"
              : "text-[var(--ink)]"
        }`}
      >
        {formatKrw(value)}
      </p>
    </article>
  );
}
