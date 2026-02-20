"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { CategoryBreakdown } from "@/lib/types";

const COLORS = ["#0f766e", "#0369a1", "#16a34a", "#ca8a04", "#ea580c", "#be123c", "#7c3aed"];

type Props = {
  data: CategoryBreakdown[];
  title: string;
};

export function ExpensePieChart({ data, title }: Props) {
  return (
    <article className="card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[var(--ink)]">{title}</h3>
        <span className="text-xs text-[var(--muted)]">상위 {Math.min(data.length, 7)}개</span>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data.slice(0, 7)}
              dataKey="amount"
              nameKey="name"
              innerRadius={58}
              outerRadius={92}
              paddingAngle={2}
            >
              {data.slice(0, 7).map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => Number(value ?? 0).toLocaleString("ko-KR")} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
