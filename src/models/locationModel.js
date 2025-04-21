const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

// fetching as per zip code
export async function fetchLocationsByZipCodes(zipCodes) {
  try {
    if (!zipCodes || zipCodes.length === 0) {
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(zipCodes),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
}

// search locaiton with filters
export async function searchLocations(searchParams) {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(searchParams),
    });

    if (!response.ok) {
      throw new Error(`Location search failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching locations:", error);
    throw error;
  }
}

// dropdown stats
export async function getStatesList() {
  try {
    // This is a mock function since the API doesn't have a specific endpoint for states
    // In a real app, we'd either have an endpoint or derive this from location data
    return [
      "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
      "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
      "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
      "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
      "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
      "DC"
    ];
  } catch (error) {
    console.error("Error getting states list:", error);
    throw error;
  }
}