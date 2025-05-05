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
    .from('songs')
    .select('song_url, submitting_user, submitted_at')
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

  // Check if the group is still accepting submissions
  const { data: groupData, error: groupError } = await supabase
    .from('groups')
    .select('start_time')
    .eq('group_id', group_id)
    .single();

  if (groupError) {
    return new Response(JSON.stringify({ error: 'Failed to fetch group data' }), { status: 400 });
  }

  const startTime = new Date(groupData.start_time);
  const currentTime = new Date();
  const timeDiff = currentTime.getTime() - startTime.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  if (hoursDiff >= 1) {
    return new Response(JSON.stringify({ error: 'Submission time has expired' }), { status: 400 });
  }

  const submitted_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('songs')
    .insert([{ 
      group_id, 
      submitting_user, 
      song_url,
      submitted_at 
    }]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify(data), { status: 201 });
}
