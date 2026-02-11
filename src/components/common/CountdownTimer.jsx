import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

export default function CountdownTimer({ endTime, className, size = 'md' }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
      hours: Math.floor(diff / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      expired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.expired) return <span className="text-gray-400 font-medium">Expired</span>;

  const pad = (n) => String(n).padStart(2, '0');
  const boxSize = size === 'lg' ? 'w-14 h-14 text-xl' : size === 'md' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm';

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[
        { val: pad(timeLeft.hours), label: 'HRS' },
        { val: pad(timeLeft.minutes), label: 'MIN' },
        { val: pad(timeLeft.seconds), label: 'SEC' },
      ].map((unit, i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-white/60 font-bold text-lg">:</span>}
          <div className="flex flex-col items-center">
            <div className={cn('flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg font-mono font-bold text-white', boxSize)}>
              {unit.val}
            </div>
            {size !== 'sm' && <span className="text-[10px] text-white/50 mt-1">{unit.label}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
