import { NextRequest, NextResponse } from "next/server";
import { searchAirports } from "@/lib/amadeus";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword") || "";

    const airports = await searchAirports(keyword);
    console.log("Airports found:", airports);
    return NextResponse.json({ data: airports });

  } catch (error) {
    console.error("Airport search error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to search airports" },
      { status: 500 }
    );
  }
}
