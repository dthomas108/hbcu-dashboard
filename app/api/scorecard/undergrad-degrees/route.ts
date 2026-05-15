import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ScorecardResult = {
  school?: {
    id?: string;
  };
  cip?: {
    code?: string;
    title?: string;
  };
  credential?: {
    level?: number;
  };
  counts?: {
    awards?: number;
  };
  year?: number;
};

type DegreeRow = {
  cip?: string;
  name?: string;
  awards: number;
  year?: number;
};

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

  const degreePrograms = [
    "agriculture",
    "resources",
    "architecture",
    "ethnic_cultural_gender",
    "communication",
    "communications_technology",
    "computer",
    "personal_culinary",
    "education",
    "engineering",
    "engineering_technology",
    "language",
    "family_consumer_science",
    "legal",
    "english",
    "humanities",
    "library",
    "biological",
    "mathematics",
    "military",
    "multidiscipline",
    "parks_recreation_fitness",
    "philosophy_religious",
    "theology_religious_vocation",
    "physical_science",
    "science_technology",
    "psychology",
    "security_law_enforcement",
    "public_administration_social_service",
    "social_science",
    "construction",
    "mechanic_repair_technology",
    "precision_production",
    "transportation",
    "visual_performing",
    "health",
    "business_marketing",
    "history",
  ];

  const degreeFields = [];

  for (const program of degreePrograms) {
    degreeFields.push(`latest.academics.program_percentage.${program}`);
  }

  const fields = ["id", "school.name", ...degreeFields].join(",");

  const url = new URL(BASE_URL);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("fields", fields);
  url.searchParams.set("id", id);
  url.searchParams.set("per_page", "100");

  console.log(url.toString());

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Scorecard API error", detail: text },
      { status: 502 },
    );
  }

  const data = await res.json();

  // Filter to undergraduate credentials (Bachelor’s = 3)

  const rows = (data.results ?? [])
    .filter((r: ScorecardResult) => r?.credential?.level === 3)
    .map((r: ScorecardResult) => ({
      cip: r?.cip?.code,
      name: r?.cip?.title,
      awards: r?.counts?.awards ?? 0,
      year: r?.year,
    }))
    .filter((r: DegreeRow) => r.awards > 0)
    .sort((a: DegreeRow, b: DegreeRow) => b.awards - a.awards)
    .slice(0, 10);

  return NextResponse.json({
    institution_id: id,
    year: rows[0]?.year ?? null,
    degrees: rows,
  });
}
