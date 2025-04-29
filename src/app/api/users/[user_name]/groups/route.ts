import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

// Helper to extract user_name from the URL
function getUserNameFromPath(request: NextRequest): string | null {
  const segments = request.nextUrl.pathname.split('/');
  const userIndex = segments.findIndex(segment => segment === 'users');
  return userIndex !== -1 && segments.length > userIndex + 1 ? segments[userIndex + 1] : null;
}

export async function GET(request: NextRequest) {
  const user_name = getUserNameFromPath(request);

  if (!user_name) {
    return new Response(JSON.stringify({ error: 'Missing user_name' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_name', user_name);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 404 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
