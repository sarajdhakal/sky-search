export interface Airport {
  iataCode: string;
  name: string;
  city: string;
  country: string;
}

export interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  duration: string;
  numberOfStops: number;
}

export interface FlightItinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface FlightPrice {
  currency: string;
  total: string;
  base: string;
  grandTotal: string;
}

export interface FlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  itineraries: FlightItinerary[];
  price: FlightPrice;
  validatingAirlineCodes: string[];
  travelerPricings: {
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
    };
  }[];
  numberOfBookableSeats?: number;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  travelClass: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  nonStop?: boolean;
}

export interface FilterState {
  stops: number[];
  priceRange: [number, number];
  airlines: string[];
  departureTimeRange: [number, number];
  arrivalTimeRange: [number, number];
  duration: number;
}

export interface Airline {
  code: string;
  name: string;
}

export interface PriceDataPoint {
  date: string;
  price: number;
  filteredPrice?: number;
}

export const AIRLINES: Record<string, string> = {
  AA: "American Airlines",
  UA: "United Airlines",
  DL: "Delta Air Lines",
  WN: "Southwest Airlines",
  B6: "JetBlue Airways",
  AS: "Alaska Airlines",
  NK: "Spirit Airlines",
  F9: "Frontier Airlines",
  BA: "British Airways",
  LH: "Lufthansa",
  AF: "Air France",
  KL: "KLM",
  EK: "Emirates",
  QR: "Qatar Airways",
  SQ: "Singapore Airlines",
  CX: "Cathay Pacific",
  JL: "Japan Airlines",
  NH: "All Nippon Airways",
  TK: "Turkish Airlines",
  EY: "Etihad Airways",
  QF: "Qantas",
  VS: "Virgin Atlantic",
  IB: "Iberia",
  AZ: "ITA Airways",
  LX: "Swiss International",
  OS: "Austrian Airlines",
  SN: "Brussels Airlines",
  TP: "TAP Air Portugal",
  AY: "Finnair",
  SK: "SAS Scandinavian",
};

export const POPULAR_AIRPORTS: Airport[] = [
  { iataCode: "JFK", name: "John F. Kennedy International", city: "New York", country: "USA" },
  { iataCode: "LAX", name: "Los Angeles International", city: "Los Angeles", country: "USA" },
  { iataCode: "ORD", name: "O'Hare International", city: "Chicago", country: "USA" },
  { iataCode: "LHR", name: "Heathrow", city: "London", country: "UK" },
  { iataCode: "CDG", name: "Charles de Gaulle", city: "Paris", country: "France" },
  { iataCode: "DXB", name: "Dubai International", city: "Dubai", country: "UAE" },
  { iataCode: "SIN", name: "Changi", city: "Singapore", country: "Singapore" },
  { iataCode: "HND", name: "Haneda", city: "Tokyo", country: "Japan" },
  { iataCode: "SFO", name: "San Francisco International", city: "San Francisco", country: "USA" },
  { iataCode: "MIA", name: "Miami International", city: "Miami", country: "USA" },
  { iataCode: "BOS", name: "Logan International", city: "Boston", country: "USA" },
  { iataCode: "SEA", name: "Seattle-Tacoma International", city: "Seattle", country: "USA" },
  { iataCode: "ATL", name: "Hartsfield-Jackson International", city: "Atlanta", country: "USA" },
  { iataCode: "DFW", name: "Dallas/Fort Worth International", city: "Dallas", country: "USA" },
  { iataCode: "DEN", name: "Denver International", city: "Denver", country: "USA" },
  { iataCode: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
  { iataCode: "AMS", name: "Schiphol", city: "Amsterdam", country: "Netherlands" },
  { iataCode: "MAD", name: "Adolfo Suárez Madrid–Barajas", city: "Madrid", country: "Spain" },
  { iataCode: "FCO", name: "Leonardo da Vinci–Fiumicino", city: "Rome", country: "Italy" },
  { iataCode: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey" },
  { iataCode: "SYD", name: "Sydney Airport", city: "Sydney", country: "Australia" },
  { iataCode: "HKG", name: "Hong Kong International", city: "Hong Kong", country: "China" },
  { iataCode: "ICN", name: "Incheon International", city: "Seoul", country: "South Korea" },
  { iataCode: "BKK", name: "Suvarnabhumi", city: "Bangkok", country: "Thailand" },
];
