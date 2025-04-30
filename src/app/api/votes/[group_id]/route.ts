import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

function getGroupIdFromPath(request: NextRequest) {
  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean); // removes empty strings
  const group_id = segments[segments.length - 1];
  return group_id
}

export async function GET(request: NextRequest) {
  const group_id = getGroupIdFromPath(request);

  if (!group_id) {
    return new Response(JSON.stringify({ error: 'Missing group_id' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('votes')
    .select('voting_user, song_url')
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
  const { voting_user, song_url } = body;

  if (!voting_user || !song_url) {
    return new Response(JSON.stringify({ error: 'Missing voting_user or song_url in request body' }), { status: 400 });
  }

  // Check if user has already voted in this group
  const { data: existingVotes, error: checkError } = await supabase
    .from('votes')
    .select('song_url')
    .eq('group_id', group_id)
    .eq('voting_user', voting_user);

  if (checkError) {
    return new Response(JSON.stringify({ error: checkError.message }), { status: 400 });
  }

  if (existingVotes && existingVotes.length > 0) {
    return new Response(JSON.stringify({ error: 'User has already voted in this group' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('votes')
    .insert([{ group_id, voting_user, song_url }]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify(data), { status: 201 });
}
