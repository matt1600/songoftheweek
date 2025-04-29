'use client';

import React, { useEffect, useState } from 'react';

type YouTubeVideoCardProps = {
  videoUrl: string;
};

export default function YouTubeVideoCard({ videoUrl }: YouTubeVideoCardProps) {
  const [title, setTitle] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
          videoUrl
        )}&format=json`;
        const res = await fetch(oEmbedUrl);
        if (!res.ok) throw new Error('Failed to fetch video info');
        const data = await res.json();
        setTitle(data.title);
        setThumbnailUrl(data.thumbnail_url);
      } catch (err) {
        setError('Unable to load video info.');
      }
    };

    fetchVideoData();
  }, [videoUrl]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-80 border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
    >
      {thumbnailUrl && (
        <img src={thumbnailUrl} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h2 className="text-lg font-semibold">{title || 'Loading...'}</h2>
        <p className="text-sm text-gray-500">YouTube Video</p>
      </div>
    </a>
  );
}
