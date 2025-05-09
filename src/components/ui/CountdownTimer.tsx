import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  onComplete?: () => void;
}

export const CountdownTimer = ({ onComplete }: CountdownTimerProps) => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center gap-1">
      <span className="countdown font-mono">
        <span style={{ '--value': seconds } as React.CSSProperties} aria-live="polite">
          {seconds}
        </span>
      </span>
      <span>s</span>
    </div>
  );
}; 