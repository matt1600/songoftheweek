'use client';

import { useState, useEffect } from 'react';

interface VotingCountdownProps {
  endTime: string; // This is UTC time from the database
  onEnd: () => void;
}

export default function VotingCountdown({ endTime, onEnd }: VotingCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Convert UTC time from database to local time
      const end = new Date(endTime);
      const now = new Date();
      const difference = end.getTime() - now.getTime();

      if (difference <= 0) {
        onEnd();
        return 'Voting has ended';
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onEnd]);

  // Format the end time for display in local timezone
  const formatEndTime = () => {
    const end = new Date(endTime);
    return end.toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short'
    });
  };

  return (
    <div className="voting-countdown">
      <h3>Time Remaining:</h3>
      <p>{timeLeft}</p>
      <p className="end-time">Voting ends at: {formatEndTime()}</p>
    </div>
  );
} 