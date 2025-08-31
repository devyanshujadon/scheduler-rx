import { supabase } from '../../../lib/supabaseClient';
import { twitterClient } from '../../../lib/twitterClient';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .lte('schedule_time', new Date().toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (posts) {
    for (const post of posts) {
      try {
        await twitterClient.v2.tweet(post.content);
        await supabase.from('posts').delete().match({ id: post.id });
      } catch (e) {
        console.error(e);
      }
    }
  }

  return NextResponse.json({ success: true });
}
