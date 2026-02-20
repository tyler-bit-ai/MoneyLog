import { formatKrw } from "@/lib/format";
import { CardTargetRow, TransferTodoRow } from "@/lib/types";

type Props = {
  cards: CardTargetRow[];
  transfers: TransferTodoRow[];
};

export function ChecklistPanel({ cards, transfers }: Props) {
  return (
    <article className="card space-y-5">
      <section>
        <h3 className="text-base font-semibold text-[var(--ink)]">매달 써야 하는 카드</h3>
        <ul className="mt-3 space-y-2">
          {cards.map((item) => (
            <li
              key={item.cardName}
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-2"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-[var(--ink)]">{item.cardName}</p>
                <p className="text-sm font-semibold text-[var(--ink)]">{formatKrw(item.targetAmount)}</p>
              </div>
              {item.note ? <p className="text-xs text-[var(--muted)]">{item.note}</p> : null}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-base font-semibold text-[var(--ink)]">챙겨야 하는 자동이체</h3>
        <ul className="mt-3 space-y-2">
          {transfers.map((item) => (
            <li
              key={item.name}
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-2"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-[var(--ink)]">{item.name}</p>
                <p className="text-sm font-semibold text-[var(--ink)]">{formatKrw(item.targetAmount)}</p>
              </div>
              {item.note ? <p className="text-xs text-[var(--muted)]">{item.note}</p> : null}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
