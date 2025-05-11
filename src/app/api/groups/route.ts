import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { group_id, created_by, phone_number } = body;

  if (!group_id || !created_by || !phone_number) {
    return new Response(JSON.stringify({ error: 'Missing group_id, created_by, or phone_number' }), { status: 400 });
  }

  // Validate phone number format (basic validation)
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  if (!phoneRegex.test(phone_number)) {
    return new Response(JSON.stringify({ error: 'Invalid phone number format' }), { status: 400 });
  }

  const start_time = new Date().toISOString();

  const { error: groupError } = await supabase
    .from('groups')
    .insert([{ 
      group_id: group_id, 
      is_finished: false,
      start_time: start_time
    }]);

  if (groupError) {
    return new Response(JSON.stringify({ error: groupError.message }), { status: 400 });
  }

  const { error: memberError } = await supabase
    .from('group_members')
    .insert([{ group_id: group_id, user_name: created_by, is_owner: true, phone_number }]);

  if (memberError) {
    return new Response(JSON.stringify({ error: memberError.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ group_id: group_id, start_time: start_time }), { status: 201 });
}