import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

// Helper to extract group_id from the URL
function getGroupIdFromPath(request: NextRequest): string | null {
  const segments = request.nextUrl.pathname.split('/');
  const groupIndex = segments.findIndex(segment => segment === 'groups');
  return groupIndex !== -1 && segments.length > groupIndex + 1 ? segments[groupIndex + 1] : null;
}

export async function GET(request: NextRequest) {
  const group_id = getGroupIdFromPath(request);

  if (!group_id) {
    return new Response(JSON.stringify({ error: 'Missing group_id' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('songs')
    .select('song_url')
    .ilike('group_id', group_id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 404 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request: NextRequest) {
  const group_id = getGroupIdFromPath(request);

  if (!group_id) {
    return new Response(JSON.stringify({ error: 'Missing group_id' }), { status: 400 });
  }

  const body = await request.json();
  const { submitting_user, song_url } = body;

  if (!submitting_user || !song_url) {
    return new Response(JSON.stringify({ error: 'Missing submitting_user or song_url in request body' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('songs')
    .insert([{ group_id, submitting_user, song_url }]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify(data), { status: 201 });
}
