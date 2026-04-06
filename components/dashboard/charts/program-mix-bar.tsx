"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ScorecardSchool } from "@/lib/scorecard/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// WHERE IS THE COLOR!? //


export function ProgramMixBar({ school }: { school?: ScorecardSchool }) {
  const p = school?.latest?.academics?.program_percentage;

  const rows = [
    { name: "Business", value: p?.business_marketing ?? 0 },
    { name: "Health", value: p?.health ?? 0 },
    { name: "Computer", value: p?.computer ?? 0 },
    { name: "Engineering", value: p?.engineering ?? 0 },
    { name: "Education", value: p?.education ?? 0 },
    { name: "Biological", value: p?.biological ?? 0 },
  ].sort((a, b) => b.value - a.value);

  const config = {
    
          "Business": { label: "Business", color: "var(--chart-1)" },
    Health: { label: "Health", color: "var(--chart-2)" },
    Computer: { label: "Computer", color: "var(--chart-3)" },
    Engineering: { label: "Engineering", color: "var(--chart-4)" },
    Education: { label: "Education", color: "var(--chart-5)" },
    Biological: { label: "Biological", color: "var(--muted)" },
  } as const;

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CardHeader>
        <CardTitle className="text-base">
          Program Mix (Share of Degrees Awarded)
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={config} className="h-[300px]">
          <BarChart data={rows} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={90}
            />
            <XAxis
              type="number"
              tickFormatter={(v) => `${Math.round(v * 100)}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={3} />
          </BarChart>
        </ChartContainer>

        <p className="mt-3 text-xs text-muted-foreground">
          * Initial version uses Scorecard “program_percentage” (2‑digit CIP
          groups). Replace with “Top 10 degrees awarded” later.
        </p>
      </CardContent>
    </Card>
  );
}
