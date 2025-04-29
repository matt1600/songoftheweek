import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

// Helper to extract group_id from URL
function getGroupIdFromPath(request: NextRequest): string | null {
  const segments = request.nextUrl.pathname.split('/');
  const groupIndex = segments.findIndex(segment => segment === 'groups');
  return groupIndex !== -1 && segments.length > groupIndex + 1 ? segments[groupIndex + 1] : null;
}

export async function POST(request: NextRequest) {
  const group_id = getGroupIdFromPath(request);
  const body = await request.json();
  const { status } = body;

  if (!group_id || typeof status !== 'string') {
    return new Response(JSON.stringify({ error: 'Missing group_id or status' }), { status: 400 });
  }

  const isFinished = status === 'ended';

  const { error } = await supabase
    .from('groups')
    .update({ is_finished: isFinished })
    .eq('group_id', group_id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ message: `Group marked as ${status}` }), { status: 200 });
}

export async function GET(request: NextRequest) {
  const group_id = getGroupIdFromPath(request);

  if (!group_id) {
    return new Response(JSON.stringify({ error: 'Missing group_id' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('groups')
    .select('is_finished')
    .eq('group_id', group_id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 404 });
  }

  return new Response(JSON.stringify({ is_finished: data.is_finished }), { status: 200 });
}
