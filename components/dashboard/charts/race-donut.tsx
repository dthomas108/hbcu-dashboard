"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ScorecardSchool } from "@/lib/scorecard/types";

export function RaceDonut({ school }: { school?: ScorecardSchool }) {
  const r = school?.latest?.student?.demographics?.race_ethnicity;
  const toPct = (v?: number) => (v != null ? v * 100 : 0);

const data = [
  { name: "Black", value: toPct(r?.black) },
  { name: "White", value: toPct(r?.white) },
  { name: "Hispanic", value: toPct(r?.hispanic) },
  { name: "Asian", value: toPct(r?.asian) },
  { name: "Two or More", value: toPct(r?.two_or_more) },
  {
    name: "Other",
    value:
      toPct(r?.aian) +
      toPct(r?.nhpi) +
      toPct(r?.non_resident_alien) +
      toPct(r?.unknown),
  },
].filter(d => d.value > 0);

  const config = {
    Black: { label: "Black", color: "hsl(var(--chart-1))" },
    White: { label: "White", color: "hsl(var(--chart-2))" },
    Hispanic: { label: "Hispanic", color: "hsl(var(--chart-3))" },
    Asian: { label: "Asian", color: "hsl(var(--chart-4))" },
    "Two+": { label: "Two+", color: "hsl(var(--chart-5))" },
    "Other/Unknown": { label: "Other/Unknown", color: "hsl(var(--muted))" },
  } as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Enrollment by Race/Ethnicity</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Pie data={data} dataKey="value" nameKey="name"
  label={({ value }) => `${value.toFixed(0)}%`}
/>
          </PieChart>
        </ChartContainer>
        <p className="mt-3 text-sm text-muted-foreground">
          Values are shares (0–1) of undergraduate degree-seeking enrollment.
        </p>
      </CardContent>
    </Card>
  );
}