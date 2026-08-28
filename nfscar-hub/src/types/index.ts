export interface Business {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  business_id: string;
  name: string;
  address?: string;
  google_review_url: string;
  created_at: string;
  updated_at: string;
}

export interface NFCCard {
  id: string;
  location_id: string;
  short_code: string;
  destination_url: string;
  is_active: boolean;
  tap_count: number;
  last_tap_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NFCCardWithRelations extends NFCCard {
  location: Location;
  business: Business;
}

export interface ShortURL {
  code: string;
  destination_url: string;
  full_url: string;
}

export type CardStatus = "active" | "inactive";
