'use client';

import { useEffect } from 'react';

const FONT_URL =
  'https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&f[]=general-sans@700,600,500,400&display=swap';

export function FontLoader() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_URL}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);

  return null;
}
