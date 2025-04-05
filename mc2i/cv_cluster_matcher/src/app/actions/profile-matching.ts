export async function matchProfiles(profile_key: string) {
  try {
    if (!profile_key) {
      return {
        success: false,
        error: 'Profile data is required'
      };
    }
    
    // Prepare query parameters
    const queryParams = new URLSearchParams({
      "profile_key": profile_key,
      "source_key": "98ef0e9ed130f2fe9fe85b01b082811ad89e6c01",
      "source_keys": JSON.stringify([
        "bbf2ba7d8183599313e8d0df8e5a75fd55e8b62d", // JUNIOR
        "e3ee5f76493820c3f316c26a103e50787bbbd398", // EXPERIMENTE 
        "0160565399cc174e01fe423816ea1a3687425001" // MANAGER
      ]),
      "page": "1",
      "limit": "300",
      "order_by": "desc",
    });
    
    // Call the HrFlow.ai API to match profiles
    const response = await fetch(`https://api.hrflow.ai/v1/profiles/matching?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.NEXT_PUBLIC_HRFLOW_API_KEY || '',
        'X-USER-EMAIL': process.env.NEXT_PUBLIC_HRFLOW_USER_EMAIL || '',
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to match profiles'
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data
    };
    
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Internal server error'
    };
  }
}