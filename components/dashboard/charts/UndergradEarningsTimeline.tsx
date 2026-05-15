"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  useChart,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export function UndergradEarningsTimeline({
  institutionId,
}: {
  institutionId: string;
}) {
  const { data } = useSWR(
    institutionId
      ? `/api/scorecard/undergrad-earnings?id=${institutionId}`
      : null,
    fetcher,
  );

  if (!data?.earnings) return null;

  const rows = [
    { year: "1 year", value: data?.earnings?.year_1 },
    { year: "5 years", value: data?.earnings?.year_5 },
    { year: "10 years", value: data?.earnings?.year_10 },
  ].filter((d) => typeof d.value === "number");

  const config = {
    value: {
      label: "Median earnings",
      color: "var(--chart-1)",
    },
  } as const;

  if (!rows.length) {
    return (
      <Card className="h-[360px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-base">Undergraduate Earnings</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Earnings data not available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CardHeader>
        <CardTitle className="text-base">
          Undergraduate Earnings After Completion
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Median earnings of undergraduate completers
        </p>
      </CardHeader>

      <CardContent>
        <ChartContainer config={config} className="h-[280px]">
          <EarningsChart rows={rows} />
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function EarningsChart({ rows }: { rows: { year: string; value: number }[] }) {
  const { getColor } = useChart();
  return (
    <LineChart
      data={rows}
      margin={{ top: 16, right: 175, bottom: -28, left: -32 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" tickMargin={8} />
      <YAxis
        tickFormatter={(v) =>
          v?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          })
        }
      />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Line
        dataKey="value"
        stroke={getColor("value")}
        strokeWidth={3}
        dot={{ r: 5 }}
      />
    </LineChart>
  );
}
