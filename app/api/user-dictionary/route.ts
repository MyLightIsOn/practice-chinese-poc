import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Get user's dictionary entries
  const { data, error } = await supabase
    .from('vocab_entry')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ entries: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Get request body
  const body = await request.json();

  if (!body.simplified) {
    return NextResponse.json(
      { error: 'Simplified character is required' },
      { status: 400 }
    );
  }

  // Insert the entry with the user's ID
  const { data, error } = await supabase
    .from('vocab_entry')
    .insert({
      user_id: session.user.id,
      simplified: body.simplified,
      traditional: body.traditional,
      pinyin: body.pinyin,
      definition: body.definition,
      notes: body.notes
    })
    .select('id');

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    id: data[0].id
  });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const simplified = url.searchParams.get('simplified');

  if (!simplified) {
    return NextResponse.json(
      { error: 'Simplified character is required' },
      { status: 400 }
    );
  }

  // Delete the entry
  const { error } = await supabase
    .from('vocab_entry')
    .delete()
    .eq('user_id', session.user.id)
    .eq('simplified', simplified);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
