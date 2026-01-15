import { FlightOffer, SearchParams, Airport, POPULAR_AIRPORTS } from "@/types/flight";

const AMADEUS_API_BASE = "https://test.api.amadeus.com";

interface AmadeusToken {
  access_token: string;
  expires_at: number;
}

let cachedToken: AmadeusToken | null = null;

export async function getAmadeusToken(): Promise<string> {
  const now = Date.now();

  if (cachedToken && cachedToken.expires_at > now + 60000) {
    return cachedToken.access_token;
  }

  const clientId = process.env.AMADEUS_API_KEY;
  const clientSecret = process.env.AMADEUS_API_SECRET;
  // console.log("Amadeus Client ID:", clientId);
  // console.log("Amadeus Client Secret:", clientSecret);

  if (!clientId || !clientSecret) {
    throw new Error("Amadeus API credentials not configured");
  }

  const response = await fetch(`${AMADEUS_API_BASE}/v1/security/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get Amadeus access token");
  }

  const data = await response.json();
  console.log("RAW AMADEUS RESPONSE:", data);

  cachedToken = {
    access_token: data.access_token,
    expires_at: now + data.expires_in * 1000,
  };

  return cachedToken.access_token;
}

export async function searchFlights(params: SearchParams): Promise<FlightOffer[]> {
  const token = await getAmadeusToken();

  const queryParams = new URLSearchParams({
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.departureDate,
    adults: params.adults.toString(),
    travelClass: params.travelClass,
    currencyCode: "USD",
    max: "50",
  });

  if (params.returnDate) {
    queryParams.set("returnDate", params.returnDate);
  }

  if (params.children > 0) {
    queryParams.set("children", params.children.toString());
  }

  if (params.infants > 0) {
    queryParams.set("infants", params.infants.toString());
  }

  if (params.nonStop) {
    queryParams.set("nonStop", "true");
  }

  const response = await fetch(
    `${AMADEUS_API_BASE}/v2/shopping/flight-offers?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("Amadeus API Error:", error);
    throw new Error(error.errors?.[0]?.detail || "Failed to search flights");
  }

  const data = await response.json();
  return data.data || [];
}

export async function searchAirports(keyword: string): Promise<Airport[]> {
  if (!keyword || keyword.length < 2) {
    return POPULAR_AIRPORTS.slice(0, 5);
  }

  const upperKeyword = keyword.toUpperCase();
  const lowerKeyword = keyword.toLowerCase();

  // First search in popular airports
  const localMatches = POPULAR_AIRPORTS.filter(
    (airport) =>
      airport.iataCode.includes(upperKeyword) ||
      airport.city.toLowerCase().includes(lowerKeyword) ||
      airport.name.toLowerCase().includes(lowerKeyword)
  );

  if (localMatches.length > 0) {
    return localMatches.slice(0, 10);
  }

  // Fall back to API if no local matches
  try {
    const token = await getAmadeusToken();

    const response = await fetch(
      `${AMADEUS_API_BASE}/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(keyword)}&page[limit]=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return localMatches;
    }

    const data = await response.json();

    return (data.data || []).map((item: {
      iataCode: string;
      name: string;
      address?: { cityName?: string; countryName?: string };
    }) => ({
      iataCode: item.iataCode,
      name: item.name,
      city: item.address?.cityName || "",
      country: item.address?.countryName || "",
    }));
  } catch {
    return localMatches;
  }
}
