'use client';

import { useState, useEffect } from 'react';

interface VotingCountdownProps {
  endTime: string;
  onEnd: () => void;
}

export default function VotingCountdown({ endTime, onEnd }: VotingCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const difference = end - now;

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

  return (
    <div className="voting-countdown">
      <h3>Time Remaining:</h3>
      <p>{timeLeft}</p>
    </div>
  );
} 