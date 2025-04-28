import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: { group_id: string } }) {
  const { group_id } = params;

  if (!group_id) {
    return new Response(JSON.stringify({ error: 'Missing group_id' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('group_members')
    .select('user_name')
    .ilike('group_id', group_id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 404 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request: Request, { params }: { params: { group_id: string } }) {
  const { group_id } = params;

  if (!group_id) {
    return new Response(JSON.stringify({ error: 'Missing group_id' }), { status: 400 });
  }

  const body = await request.json();
  const { user_name } = body;

  if (!user_name) {
    return new Response(JSON.stringify({ error: 'Missing user_name in request body' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('group_members')
    .insert([{ group_id, user_name, false }]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify(data), { status: 201 });
}