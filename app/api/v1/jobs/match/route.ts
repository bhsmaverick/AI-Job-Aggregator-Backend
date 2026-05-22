import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const acceptLanguage = request.headers.get('accept-language') || 'EN';

    const response = await fetch(`${backendUrl}/api/v1/jobs/match`, {
      method: 'POST',
      headers: {
        'Accept-Language': acceptLanguage,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Match Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error forwarding request to backend' },
      { status: 500 }
    );
  }
}
