import { NextRequest, NextResponse } from "next/server";
import { searchFlights } from "@/lib/amadeus";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !process.env.AMADEUS_API_KEY ||
      !process.env.AMADEUS_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Amadeus credentials are not configured" },
        { status: 500 }
      );
    }

    const flights = await searchFlights(body);

    return NextResponse.json({ data: flights });

  } catch (error) {
    console.error("Flight search error:", error);

    return NextResponse.json(
      { error: "Failed to fetch flight offers" },
      { status: 500 }
    );
  }
}
