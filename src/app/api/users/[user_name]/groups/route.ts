import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: { user_name: string } }) {
  const { user_name } = params;

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
