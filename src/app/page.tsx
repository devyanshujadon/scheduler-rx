"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [postContent, setPostContent] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/schedule');
      const { data } = await response.json();
      setScheduledPosts(data);
    };
    fetchPosts();
  }, []);

  const handleSchedulePost = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postContent, scheduleTime }),
    });
    setPostContent('');
    setScheduleTime('');
    const response = await fetch('/api/schedule');
    const { data } = await response.json();
    setScheduledPosts(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Post Scheduler</h1>
        <form onSubmit={handleSchedulePost}>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="What's happening?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          ></textarea>
          <input
            type="datetime-local"
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors"
          >
            Schedule Post
          </button>
        </form>
      </div>
      <div className="w-full max-w-md mt-8">
        <h2 className="text-xl font-bold text-center mb-4">Scheduled Posts</h2>
        <ul className="bg-white p-4 rounded-lg shadow-md">
          {scheduledPosts.map((post) => (
            <li key={post.id} className="border-b border-gray-200 py-2">
              <p className="text-gray-800">{post.content}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.schedule_time).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
