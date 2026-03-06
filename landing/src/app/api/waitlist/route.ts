import { NextRequest, NextResponse } from 'next/server';
import getClientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 254) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase().slice(0, 254);

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
