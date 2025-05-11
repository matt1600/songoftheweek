'use client';

import React, { useEffect, useState } from 'react';
import "@/styles/youtube-video-card.css"

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
    <a href={videoUrl} className="youtube-card" target="_blank" rel="noopener noreferrer">
        <div className="youtube-thumbnail">
            <img src={thumbnailUrl} alt={title} />
        </div>
        <div className="youtube-card-body">
            <h4>{title || 'Loading...'}</h4>
        </div>
    </a>
  );
}
