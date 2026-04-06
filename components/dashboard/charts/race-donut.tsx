"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  useChart,
} from "@/components/ui/chart";
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
  ].filter((d) => d.value > 0);

  const config = {
    Black: { label: "Black", color: "var(--chart-1)" },
    White: { label: "White", color: "var(--chart-2)" },
    Hispanic: { label: "Hispanic", color: "var(--chart-3)" },
    Asian: { label: "Asian", color: "var(--chart-4)" },
    "Two or More": { label: "Two or More", color: "var(--chart-5)" },
    Other: { label: "Other", color: "var(--muted)" },
  } as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Enrollment by Race / Ethnicity
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="name" />}
            />

            <DonutSlices data={data} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/* ✅ Isolated slice renderer */
function DonutSlices({ data }: { data: { name: string; value: number }[] }) {
  const config = {
    Black: { label: "Black", color: "var(--chart-1)" },
    White: { label: "White", color: "var(--chart-2)" },
    Hispanic: { label: "Hispanic", color: "var(--chart-3)" },
    Asian: { label: "Asian", color: "var(--chart-4)" },
    "Two or More": { label: "Two or More", color: "var(--chart-5)" },
    Other: { label: "Other", color: "var(--muted)" },
  } as const;

  return (
    <Pie
      data={data}
      dataKey="value"
      nameKey="name"
      innerRadius={70}
      outerRadius={110}
      paddingAngle={2}
      label={({ value }) => `${value.toFixed(0)}%`}
    >
      {data.map((entry) => (
        <Cell
          key={entry.name}
          fill={config[entry.name as keyof typeof config]?.color || "var(--muted)"}
        />
      ))}
    </Pie>
  );
}