import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

function getGroupIdFromPath(request: NextRequest) {
  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const group_id = segments[segments.length - 2];
  return group_id;
}

interface SongWithSubmitter {
  song_url: string;
  submitting_user: string;
}

interface VoteResult {
  song_url: string;
  votes: number;
  submitting_user: string;
  is_winner?: boolean;
}

export async function GET(request: NextRequest) {
  const group_id = getGroupIdFromPath(request);

  if (!group_id) {
    return new Response(JSON.stringify({ error: 'Missing group_id' }), { status: 400 });
  }

  // Get all songs submitted to this group with their submitters
  const { data: songs, error: songsError } = await supabase
    .from('songs')
    .select('song_url, submitting_user')
    .eq('group_id', group_id);

  if (songsError) {
    return new Response(JSON.stringify({ error: songsError.message }), { status: 500 });
  }

  // Get all votes for this group
  const { data: votes, error: votesError } = await supabase
    .from('votes')
    .select('song_url')
    .eq('group_id', group_id);

  if (votesError) {
    return new Response(JSON.stringify({ error: votesError.message }), { status: 500 });
  }

  // Count votes for each song
  const voteCounts = new Map<string, number>();
  const songSubmitters = new Map<string, string>();
  
  songs?.forEach(song => {
    voteCounts.set(song.song_url, 0);
    songSubmitters.set(song.song_url, song.submitting_user);
  });

  votes?.forEach(vote => {
    const currentCount = voteCounts.get(vote.song_url) || 0;
    voteCounts.set(vote.song_url, currentCount + 1);
  });

  // Convert to array and sort by vote count
  const results: VoteResult[] = Array.from(voteCounts.entries())
    .map(([song_url, votes]) => ({
      song_url,
      votes,
      submitting_user: songSubmitters.get(song_url) || ''
    }))
    .sort((a, b) => {
      // First sort by vote count (descending)
      if (b.votes !== a.votes) {
        return b.votes - a.votes;
      }
      // If votes are equal, sort by submitting_user (descending, case-insensitive)
      return b.submitting_user.toLowerCase().localeCompare(a.submitting_user.toLowerCase());
    });

  // Mark the winner (first song after sorting)
  if (results.length > 0) {
    results[0].is_winner = true;
  }

  return new Response(JSON.stringify(results), { status: 200 });
} 