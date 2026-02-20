import { apiFetch } from "./client";
import type { LocationDTO, LocationsResponse } from "../types/location.types";

/** Fetches all active locations from the backend */
export async function fetchLocations(): Promise<LocationDTO[]> {
  const response = await apiFetch<LocationsResponse>("/locations");
  return response.locations;
}
