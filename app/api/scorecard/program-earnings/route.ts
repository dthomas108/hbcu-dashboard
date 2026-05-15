import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools/programs";

export async function GET(req: NextRequest) {
  const apiKey = process.env.COLLEGE_SCORECARD_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing COLLEGE_SCORECARD_API_KEY" },
      { status: 500 },
    );
  }

  const fields = [
    // institution identity
    "programs.cip_4_digit.unit_id",
    "programs.cip_4_digit.school.name",

    // program identity
    "programs.cip_4_digit.code",
    "programs.cip_4_digit.title",

    // program-level earnings
    "programs.cip_4_digit.earnings.1_yr.overall_median_earnings",
    "programs.cip_4_digit.earnings.4_yr.overall_median_earnings",
    "programs.cip_4_digit.earnings.5_yr.overall_median_earnings",
  ].join(",");

  const url = new URL(BASE_URL);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("fields", fields);
  url.searchParams.set("school.minority_serving.historically_black", "1");
  url.searchParams.set("per_page", "100");

  const res = await fetch(url.toString());

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Scorecard API error", detail: text },
      { status: 502 },
    );
  }

  const json = await res.json();
  const results = json?.results ?? [];

  const programs = results.flatMap((school: any) =>
    (school.programs?.cip_4_digit ?? []).map((p: any) => ({
      institution_id: p.unit_id,
      institution_name: p.school?.name,
      cip: p.code,
      program: p.title,
      earnings: {
        year_1: p.earnings?.["1_yr"]?.overall_median_earnings ?? null,
        year_4: p.earnings?.["4_yr"]?.overall_median_earnings ?? null,
        year_5: p.earnings?.["5_yr"]?.overall_median_earnings ?? null,
      },
    })),
  );

  return NextResponse.json({ programs });
}
