/*const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

// getting dog breeds from API
export async function fetchBreeds() {
  try {
    const response = await fetch(`${API_BASE_URL}/dogs/breeds`, {
      method: "GET",
      credentials: "include", 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch breeds: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching breeds:", error);
    throw error;
  }
}

// search dogs with filters like breed, sort, and pagination
export async function searchDogs(searchParams) {
  try {
    const queryParams = new URLSearchParams();

    if (searchParams.breeds && searchParams.breeds.length > 0) {
      searchParams.breeds.forEach(breed => {
        queryParams.append("breeds", breed);
      });
    }

    if (searchParams.sort) {
      queryParams.append("sort", searchParams.sort);
    }

    if (searchParams.size) {
      queryParams.append("size", searchParams.size);
    }

    if (searchParams.from !== undefined) {
      queryParams.append("from", searchParams.from);
    }

    const response = await fetch(`${API_BASE_URL}/dogs/search?${queryParams}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching dogs:", error);
    throw error;
  }
}


export async function fetchDogDetails(dogIds) {
  try {
    if (!dogIds || dogIds.length === 0) {
      return []; 
    }

    const response = await fetch(`${API_BASE_URL}/dogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dogIds),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dog details: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching dog details:", error);
    throw error;
  }
}

// for creating matches with favorite dogs
export async function generateMatch(favoriteIds) {
  try {
    if (!favoriteIds || favoriteIds.length === 0) {
      throw new Error("No favorite dogs selected for matching");
    }

    const response = await fetch(`${API_BASE_URL}/dogs/match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(favoriteIds),
    });

    if (!response.ok) {
      throw new Error(`Match generation failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating match:", error);
    throw error;
  }
} */

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

// getting dog breeds from API
export async function fetchBreeds() {
  try {
    const response = await fetch(`${API_BASE_URL}/dogs/breeds`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch breeds: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching breeds:", error);
    throw error;
  }
}

// search dogs with filters like breed, location, sort, and pagination
export async function searchDogs(searchParams) {
  try {
    const queryParams = new URLSearchParams();

    if (searchParams.breeds && searchParams.breeds.length > 0) {
      searchParams.breeds.forEach(breed => {
        queryParams.append("breeds", breed);
      });
    }

    // Add zipCodes filter if provided
    if (searchParams.zipCodes && searchParams.zipCodes.length > 0) {
      searchParams.zipCodes.forEach(zipCode => {
        queryParams.append("zipCodes", zipCode);
      });
    }

    // Add age filters if provided
    if (searchParams.ageMin !== undefined) {
      queryParams.append("ageMin", searchParams.ageMin);
    }

    if (searchParams.ageMax !== undefined) {
      queryParams.append("ageMax", searchParams.ageMax);
    }

    if (searchParams.sort) {
      queryParams.append("sort", searchParams.sort);
    }

    if (searchParams.size) {
      queryParams.append("size", searchParams.size);
    }

    if (searchParams.from !== undefined) {
      queryParams.append("from", searchParams.from);
    }

    const response = await fetch(`${API_BASE_URL}/dogs/search?${queryParams}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching dogs:", error);
    throw error;
  }
}

export async function fetchDogDetails(dogIds) {
  try {
    if (!dogIds || dogIds.length === 0) {
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/dogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dogIds),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dog details: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching dog details:", error);
    throw error;
  }
}

// for creating matches with favorite dogs
export async function generateMatch(favoriteIds) {
  try {
    if (!favoriteIds || favoriteIds.length === 0) {
      throw new Error("No favorite dogs selected for matching");
    }

    const response = await fetch(`${API_BASE_URL}/dogs/match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(favoriteIds),
    });

    if (!response.ok) {
      throw new Error(`Match generation failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating match:", error);
    throw error;
  }
}
