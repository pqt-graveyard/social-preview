import { useEffect, useState } from 'react';

export const useDarkmode = (): boolean => {
  const [darkmode, setDarkmode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDarkmode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  });

  return darkmode;
};
