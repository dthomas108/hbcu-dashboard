import { NextResponse } from "next/server";

// Ensure runtime execution (avoid static optimization surprises)
export const dynamic = "force-dynamic";

const BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools";

type HbcuItem = {
  id: number;
  name: string;
  state?: string;
  highestDegree?: number;
};

type ApiResult = {
  id: number;
  school?: {
    name?: string;
    state?: string;
    degrees_awarded?: {
      highest?: number;
    };
  };
};

export async function GET() {
  const apiKey = process.env.COLLEGE_SCORECARD_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing COLLEGE_SCORECARD_API_KEY" }, { status: 500 });
  }

  const fields = [
    "id",
    "school.name",
    "school.state",
    "school.degrees_awarded.highest",
    "school.minority_serving.historically_black",
  ].join(",");

  // The API supports pagination via page/per_page and returns metadata. [2](https://lehd.ces.census.gov/data/pseo_documentation.html)[1](https://pseocoalition.org/interactive-tools/)
  const perPage = 100; // max allowed per the published recipe example [2](https://lehd.ces.census.gov/data/pseo_documentation.html)
  let page = 0;

  const all: HbcuItem[] = [];

  while (true) {
    const url = new URL(BASE_URL);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("fields", fields);
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));

    // Filter to HBCUs (flag exists in the data dictionary you uploaded)
    url.searchParams.set("school.minority_serving.historically_black", "1");

    const res = await fetch(url.toString(), { headers: { "Content-Type": "application/json" } });
    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { error: "Upstream error", status: res.status, detail },
        { status: 502 }
      );
    }

    const data = await res.json();

    const results = (data?.results ?? []) as ApiResult[];
    if (results.length === 0) break;

    for (const r of results) {
      all.push({
        id: r.id,
        name: r?.school?.name ?? String(r.id),
        state: r?.school?.state,
        highestDegree: r?.school?.degrees_awarded?.highest,
      });
    }

    // Stop condition:
    // If total is present, we can stop once we collected enough. The API returns metadata including total/page/per_page. [2](https://lehd.ces.census.gov/data/pseo_documentation.html)
    const meta = data?.metadata;
    const total = meta?.total;
    if (typeof total === "number" && all.length >= total) break;

    // Otherwise, stop when the last page is shorter than perPage
    if (results.length < perPage) break;

    page += 1;
  }

  // Sort alphabetically for a nice dropdown
  all.sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json({ results: all });
}