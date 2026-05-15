import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools";

export async function GET(req: NextRequest) {
  const apiKey = process.env.COLLEGE_SCORECARD_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing COLLEGE_SCORECARD_API_KEY" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing institution id" },
      { status: 400 },
    );
  }

  const fields = [
    "id",
    "school.name",

    // earnings timeline (undergraduate)
    "latest.earnings.median_earnings.1yr_after_completion",
    "latest.earnings.median_earnings.5yr_after_completion",
    "latest.earnings.median_earnings.10yr_after_completion",

    // background proxy (for later uplift)
    "latest.student.family_income.median",
  ].join(",");

  const url = new URL(BASE_URL);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("fields", fields);
  url.searchParams.set("id", id);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Scorecard API error", detail: text },
      { status: 502 },
    );
  }

  const data = await res.json();
  const r = data?.results?.[0] ?? {};

  return NextResponse.json({
    institution_id: id,
    earnings: {
      year_1:
        r?.latest?.earnings?.median_earnings?.["1yr_after_completion"] ?? null,
      year_5:
        r?.latest?.earnings?.median_earnings?.["5yr_after_completion"] ?? null,
      year_10:
        r?.latest?.earnings?.median_earnings?.["10yr_after_completion"] ?? null,
    },
    median_family_income: r?.latest?.student?.family_income?.median ?? null,
  });
}
