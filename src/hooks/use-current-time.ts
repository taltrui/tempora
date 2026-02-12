import { useState, useEffect } from 'react';

export function useCurrentTime(enabled: boolean = true): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => clearInterval(id);
  }, [enabled]);

  return now;
}
