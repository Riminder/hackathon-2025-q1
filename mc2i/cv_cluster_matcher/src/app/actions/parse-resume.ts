export async function parseResume(formData: FormData) {
  try {
    // Call the resume parsing API
    const response = await fetch('https://api.hrflow.ai/v1/profile/parsing/file', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.NEXT_PUBLIC_HRFLOW_API_KEY || '',
        'X-USER-EMAIL': process.env.NEXT_PUBLIC_HRFLOW_USER_EMAIL || '',
        // Don't set Content-Type header when sending FormData
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to parse resume'
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