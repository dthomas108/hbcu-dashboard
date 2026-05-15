"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  useChart,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";

type DegreeRow = {
  cip: string;
  name: string;
  awards: number;
};

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export function TopDegreesAwardedBar({
  institutionName, // <-- use institutionName, not institutionId
}: {
  institutionName: string;
}) {
  const { data, error } = useSWR("/data/hbcu_degrees.json", fetcher);

  if (error) return <div>Error loading data.</div>;
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Top Undergraduate Degrees Awarded
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Loading degree awards…
        </CardContent>
      </Card>
    );
  }

  // Get the data for the selected institution
  const uniData = data[institutionName];
  if (!uniData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Top Undergraduate Degrees Awarded
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No data found for this institution.
        </CardContent>
      </Card>
    );
  }

  const rows: DegreeRow[] = uniData.degrees ?? [];
  const year = uniData.year;

  const config = {
    awards: {
      label: "Degrees awarded",
    },
  } as const;

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CardHeader>
        <CardTitle className="text-base">
          Top Undergraduate Degrees Awarded
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Most recent year available {year ? `(${year})` : ""}
        </p>
      </CardHeader>
      <CardContent>
        {!rows.length ? (
          <div className="text-sm text-muted-foreground">
            No degree data found…
          </div>
        ) : (
          <ChartContainer config={config} className="h-[320px]">
            <TopDegreesChart rows={rows} />
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

/* ✅ Child component INSIDE ChartContainer */
function TopDegreesChart({ rows }: { rows: DegreeRow[] }) {
  const { getColor } = useChart(); // ✅ now context exists

  return (
    <BarChart data={rows} layout="vertical" margin={{ left: 32 }}>
      <CartesianGrid horizontal={false} />
      <YAxis
        dataKey="name"
        type="category"
        tickLine={false}
        axisLine={false}
        width={160}
      />
      <XAxis type="number" />
      <ChartTooltip content={<ChartTooltipContent />} />

      <Bar dataKey="awards" radius={6}>
        {rows.map((row) => (
          <Cell key={row.cip} fill={getColor("awards")} />
        ))}
      </Bar>
    </BarChart>
  );
}
