"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ScorecardSchool } from "@/lib/scorecard/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    value: {
      label: "Share of awards",
      color: "var(--chart-2)", // ✅ FIXED
    },
  } as const;

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CardHeader>
        <CardTitle className="text-base">
          Program Mix (Share of Degrees Awarded)
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={config} className="h-[350px] w-[450px]">
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ top: 8, right: 120, bottom: 8, left: -16 }}
          >
            <CartesianGrid horizontal={false} />

            <YAxis
              dataKey="name"
              type="category"
              width={110}
              tickLine={false}
              axisLine={false}
            />

            <XAxis
              type="number"
              tickFormatter={(v) => `${Math.round(v * 100)}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={6} />
          </BarChart>
        </ChartContainer>

        <p className="mt-3 text-xs text-muted-foreground">
          * Initial version uses Scorecard “program_percentage” (2‑digit CIP
          groups).
        </p>
      </CardContent>
    </Card>
  );
}
