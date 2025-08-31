import { supabase } from '../../../lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { postContent, scheduleTime } = await request.json();

    if (!postContent || !scheduleTime) {
      return NextResponse.json({ error: 'Missing post content or schedule time' }, { status: 400 });
    }

    const scheduleDate = new Date(scheduleTime);

    const { data, error } = await supabase
      .from('posts')
      .insert([{ content: postContent, schedule_time: scheduleDate.toISOString() }])
      .select();

    if (error) {
      // This is the important part: we log the WHOLE error object
      console.error('Supabase error:', error); 
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (e) {
    console.error('API route error:', e);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('schedule_time', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
