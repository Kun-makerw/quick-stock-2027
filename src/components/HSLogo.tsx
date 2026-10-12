import React from 'react';

export function HSLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
      <polygon points="20,20 35,20 35,45 55,45 40,60 35,60 35,65 20,80" />
      <polygon points="80,15 65,30 65,45 30,80 55,80 80,55" />
    </svg>
  );
}
