import { NextRequest, NextResponse } from 'next/server';
import getClientPromise from '@/lib/mongodb';

// Simple in-memory rate limiter (per-server instance)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 254) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase().slice(0, 254);

    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const client = await getClientPromise();
    const db = client.db('sheetos');
    const collection = db.collection('waitlist');

    const existing = await collection.findOne({ email: sanitizedEmail });
    if (existing) {
      return NextResponse.json({ message: 'Already registered' }, { status: 200 });
    }

    await collection.insertOne({
      email: sanitizedEmail,
      createdAt: new Date(),
      source: 'landing-page',
    });

    return NextResponse.json({ message: 'Subscribed' }, { status: 201 });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
