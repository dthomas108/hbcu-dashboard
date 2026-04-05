"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ScorecardSchool } from "@/lib/scorecard/types";

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
    value: { label: "Share of awards", color: "hsl(var(--chart-2))" },
  } as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Program Mix (Share of Degrees Awarded)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px]">
          <BarChart data={rows} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={90} />
            <XAxis type="number" tickFormatter={(v) => `${Math.round(v * 100)}%`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={6} />
          </BarChart>
        </ChartContainer>
        <p className="mt-3 text-xs text-muted-foreground">
          *initial version uses Scorecard “program_percentage” (2-digit CIP groups). **replace with “Top 10 degrees awarded” later.
        </p>
      </CardContent>
    </Card>
  );
}