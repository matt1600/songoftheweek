import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

function getGroupIdFromPath(request: NextRequest) {
  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const group_id = segments[segments.length - 2];
  return group_id;
}

export async function GET(request: NextRequest) {
  const group_id = getGroupIdFromPath(request);

  if (!group_id) {
    return new Response(JSON.stringify({ error: 'Missing group_id' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('group_members')
    .select('user_name, is_owner, phone_number')
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
  const { user_name, phone_number } = body;

  if (!user_name || !phone_number) {
    return new Response(JSON.stringify({ error: 'Missing user_name or phone_number in request body' }), { status: 400 });
  }

  // Validate phone number format (basic validation)
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  if (!phoneRegex.test(phone_number)) {
    return new Response(JSON.stringify({ error: 'Invalid phone number format' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('group_members')
    .upsert([{ 
      group_id, 
      user_name,
      phone_number,
      is_owner: false 
    }], {
      onConflict: 'group_id, user_name',
      ignoreDuplicates: true
    });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify(data), { status: 201 });
}