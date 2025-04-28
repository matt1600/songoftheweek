import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const { group_name, created_by } = body;

  if (!group_name || !created_by) {
    return new Response(JSON.stringify({ error: 'Missing group_name or created_by' }), { status: 400 });
  }

  const groupId = `${group_name}-${Math.random().toString(36).substring(2, 8)}`;

  const { error: groupError } = await supabase
    .from('groups')
    .insert([{ group_id: groupId, is_finished: false }]);

  if (groupError) {
    return new Response(JSON.stringify({ error: groupError.message }), { status: 400 });
  }

  const { error: memberError } = await supabase
    .from('group_members')
    .insert([{ group_id: groupId, user_name: created_by, is_owner: true }]);

  if (memberError) {
    return new Response(JSON.stringify({ error: memberError.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ group_id: groupId }), { status: 201 });
}