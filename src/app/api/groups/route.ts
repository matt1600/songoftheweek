import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { group_id, created_by, voting_end_time } = body;

  if (!group_id || !created_by || !voting_end_time) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  const { error: groupError } = await supabase
    .from('groups')
    .insert([{ 
      group_id: group_id, 
      is_finished: false,
      voting_end_time: voting_end_time 
    }]);

  if (groupError) {
    return new Response(JSON.stringify({ error: groupError.message }), { status: 400 });
  }

  const { error: memberError } = await supabase
    .from('group_members')
    .insert([{ group_id: group_id, user_name: created_by, is_owner: true }]);

  if (memberError) {
    return new Response(JSON.stringify({ error: memberError.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ group_id: group_id }), { status: 201 });
}