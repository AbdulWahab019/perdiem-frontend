/** Location data from /api/locations */
export interface AddressDTO {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface LocationDTO {
  id: string;
  name: string;
  address: AddressDTO | null;
  timezone: string | null;
  status: "ACTIVE" | "INACTIVE";
  phoneNumber?: string;
  businessEmail?: string;
}

export interface LocationsResponse {
  locations: LocationDTO[];
}
