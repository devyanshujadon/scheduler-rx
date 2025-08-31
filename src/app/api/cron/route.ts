import { supabase } from '../../../lib/supabaseClient';
import { twitterClient } from '../../../lib/twitterClient';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Cron job started');
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .lte('schedule_time', new Date().toISOString());

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (posts && posts.length > 0) {
      console.log(`Found ${posts.length} posts to process.`);
      for (const post of posts) {
        try {
          console.log(`Attempting to tweet: "${post.content}"`);
          await twitterClient.v2.tweet(post.content);
          console.log(`Successfully tweeted. Deleting post ID: ${post.id}`);
          await supabase.from('posts').delete().match({ id: post.id });
        } catch (e) {
          console.error(`Failed to process post ID: ${post.id}`, e);
        }
      }
    } else {
      console.log('No posts due for scheduling.');
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Unhandled error in cron job:', e);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
