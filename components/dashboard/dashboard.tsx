"use client";

import useSWR from "swr";
import { useState } from "react";
import { DashboardShell } from "./shell";
import { KpiCard } from "./kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScorecardSchool } from "@/lib/scorecard/types";
import { RaceDonut } from "./charts/race-donut";
import { ProgramMixBar } from "./charts/program-mix-bar";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatPct(x?: number) {
  if (x == null) return "—";
  return `${Math.round(x * 100)}%`;
}

function formatMoney(x?: number) {
  if (x == null) return "—";
  return x.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function Dashboard() {
  const [type, setType] = useState<"2" | "4">("4");
  const [hbcuOnly, setHbcuOnly] = useState<"0" | "1">("1");
  const [selectedId, setSelectedId] = useState<string>("");

  // 1) load list of schools
  const listUrl = `/api/scorecard/schools?type=${type}&hbcu=${hbcuOnly}&per_page=50`;
  const { data: listData, isLoading: listLoading } = useSWR<{ results: ScorecardSchool[] }>(listUrl, fetcher);

  const schools = listData?.results ?? [];
  const hbcuSchools = schools;

  // 2) default school if none selected
  const effectiveId = selectedId || (schools[0]?.id ? String(schools[0].id) : "");

  // 3) load details for selected school
  const detailUrl = effectiveId
    ? `/api/scorecard/schools?id=${effectiveId}&type=${type}&hbcu=${hbcuOnly}&per_page=1`
    : null;

  const { data: detailData } = useSWR<{ results: ScorecardSchool[] }>(detailUrl, fetcher);
  const school: ScorecardSchool | undefined = detailData?.results?.[0];

  const enrollment = school?.latest?.student?.size;
  const admissionRate = school?.latest?.admissions?.admission_rate?.overall;
  const netPrice =
  school?.school?.ownership === 1
    ? school?.latest?.cost?.avg_net_price?.public
    : school?.latest?.cost?.avg_net_price?.private;

const completion =
  type === "4"
    ? school?.latest?.completion?.completion_rate_4yr_150nt
    : school?.latest?.completion?.completion_rate_less_than_4yr_150nt;

  const title = school?.school?.name ?? "HBCU Comparison Tool";

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">
            HBCU Dashboard (via collegescorecard.ed.gov API)
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ToggleGroup type="single" value={type} onValueChange={(v) => v && setType(v as "2" | "4")}>
            <ToggleGroupItem value="2">2-Year</ToggleGroupItem>
            <ToggleGroupItem value="4">4-Year</ToggleGroupItem>
          </ToggleGroup>

          <ToggleGroup type="single" value={hbcuOnly} onValueChange={(v) => v && setHbcuOnly(v as "0" | "1")}>
            <ToggleGroupItem value="1">HBCU Only</ToggleGroupItem>
            <ToggleGroupItem value="0">All</ToggleGroupItem>
          </ToggleGroup>

          <Select value={effectiveId} onValueChange={(v) => setSelectedId(v)}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder={listLoading ? "Loading schools..." : "Select a school"} />
            </SelectTrigger>
            <SelectContent>
              {hbcuSchools
                .filter(Boolean)
                .map((scorecard: ScorecardSchool) => (
                  <SelectItem key={scorecard.id} value={String(scorecard.id)}>
                    {scorecard.school?.name ?? `School ${scorecard.id}`}
                    {scorecard.school?.state ? ` (${scorecard.school.state})` : ""}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Enrollment (UG)" value={enrollment?.toLocaleString() ?? "—"} />
        <KpiCard title="Net Price" value={formatMoney(netPrice)} />
        <KpiCard
          title="Admission Rate"
          value={type === "4" ? formatPct(admissionRate) : "—"}
          subtitle={type === "2" ? "Typically not applicable to 2-year" : undefined}
        />
        <KpiCard title="Completion Rate (150%)" value={formatPct(completion)} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <RaceDonut school={school} />
        <ProgramMixBar school={school} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Quick Facts</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div><span className="text-muted-foreground">City:</span> {school?.school?.city ?? "—"}</div>
            <div><span className="text-muted-foreground">State:</span> {school?.school?.state ?? "—"}</div>
            <div><span className="text-muted-foreground">Age 25+ share:</span> {formatPct(school?.latest?.student?.share_25_older)}</div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Institutional Information toggle here</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Filter by “highest degree awarded” to 2-year vs 4-year, & show/hide admissions.
          </CardContent>
        </Card>



<div className="bg-red-500 text-white p-4">
  Tailwind is working
</div>




        <div className="disclaimer text-xs text-muted-foreground">
          *Data may be incomplete or inaccurate; contact us if you find any issues or have suggestions!
        </div>
      </div>
    </DashboardShell>
  );
}