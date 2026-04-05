// src/app/api/scorecard/schools/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MVP_FIELDS } from "@/lib/scorecard/fields";
import { unflatten } from "@/lib/scorecard/unflatten";

// IMPORTANT: prevent “static optimization” from freezing env vars at build time.
export const dynamic = "force-dynamic";

const BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools";

function buildFieldsParam() {
  // The API expects comma-separated fields
  return MVP_FIELDS.join(",");
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.COLLEGE_SCORECARD_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing COLLEGE_SCORECARD_API_KEY" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);

  // Controls (from client)
  const schoolId = searchParams.get("id");        // optional
  const instType = searchParams.get("type");      // "2" or "4"
  const hbcuOnly = searchParams.get("hbcu");      // "1" or "0"
  const q = searchParams.get("q");                // optional school name search
  const page = searchParams.get("page") ?? "0";
  const perPage = searchParams.get("per_page") ?? "20";

  const upstream = new URL(BASE_URL);
  upstream.searchParams.set("api_key", apiKey);
  upstream.searchParams.set("fields", buildFieldsParam());
  upstream.searchParams.set("page", page);
  upstream.searchParams.set("per_page", perPage);

  // Filters: Scorecard supports filtering using field query params.
  // HBCU flag exists in the data dictionary as a field you can use. [1](https://onedrive.live.com/personal/6d1b32b938172d47/_layouts/15/doc.aspx?resid=ba89a19d-2999-4704-a0b2-53e3bfcd7588&cid=6d1b32b938172d47)[4](https://www.airweb.org/docs/default-source/ipeds-tutorials/ipeds-update.pdf?sfvrsn=fefc39e8_3)
  if (hbcuOnly === "1") upstream.searchParams.set("school.minority_serving.historically_black", "1");

  // “2-year vs 4-year” approximation:
  // filter by “highest degree awarded”.
  // Dictionary definition: school.degrees_awarded.highest is coded (0..4). [1](https://onedrive.live.com/personal/6d1b32b938172d47/_layouts/15/doc.aspx?resid=ba89a19d-2999-4704-a0b2-53e3bfcd7588&cid=6d1b32b938172d47)[4](https://www.airweb.org/docs/default-source/ipeds-tutorials/ipeds-update.pdf?sfvrsn=fefc39e8_3)
  // 2-year degree = Associate (2)
  // 4-year degree >= Bachelor (3-4)
  if (instType === "2") upstream.searchParams.set("school.degrees_awarded.highest", "2");
  if (instType === "4") upstream.searchParams.set("school.degrees_awarded.highest__range", "3..4");

  if (schoolId) upstream.searchParams.set("id", schoolId);
  if (q) upstream.searchParams.set("school.name", q);

  const res = await fetch(upstream.toString(), {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Upstream error", status: res.status, detail: text },
      { status: 502 }
    );
  }

const data = await res.json();

const normalized = {
  ...data,
  results: (data.results ?? []).map((r: Record<string, unknown>) => unflatten(r)),
};

return NextResponse.json(normalized);
}
