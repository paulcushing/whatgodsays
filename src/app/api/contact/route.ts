import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.email?.trim() || !data.name?.trim() || !data.message?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Call the external API with the server-side token
    const response = await fetch('https://api.paulcushing.dev/api/v1/mail/send/contact', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MAILTOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://whatgodsays.com',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('Mail API error:', response.statusText);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
