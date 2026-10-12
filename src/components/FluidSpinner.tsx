import React from 'react';

export function FluidSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  if (size === 'sm') {
    return (
      <div className="relative w-6 h-6 [perspective:1000px] shrink-0">
        <div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: 'rotateX(60deg) rotateY(20deg)' }}>
          <div className="w-full h-full rounded-full border-[2px] border-indigo-500/80 border-t-transparent animate-[spin_2.5s_linear_infinite]"></div>
        </div>
        <div className="absolute inset-[3px] [transform-style:preserve-3d]" style={{ transform: 'rotateX(30deg) rotateY(60deg)' }}>
          <div className="w-full h-full rounded-full border-[2px] border-purple-500/80 border-b-transparent animate-[spin_3s_linear_infinite_reverse]"></div>
        </div>
        <div className="absolute inset-[6px] [transform-style:preserve-3d]" style={{ transform: 'rotateX(70deg) rotateZ(45deg)' }}>
          <div className="w-full h-full rounded-full border-[1.5px] border-blue-500/80 border-l-transparent animate-[spin_2s_linear_infinite]"></div>
        </div>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className="relative w-32 h-32 [perspective:1000px]">
        <div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: 'rotateX(60deg) rotateY(20deg)' }}>
          <div className="w-full h-full rounded-full border-[3px] border-indigo-500/80 border-t-transparent animate-[spin_2.5s_linear_infinite]"></div>
        </div>
        <div className="absolute inset-3 [transform-style:preserve-3d]" style={{ transform: 'rotateX(30deg) rotateY(60deg)' }}>
          <div className="w-full h-full rounded-full border-[3px] border-purple-500/80 border-b-transparent animate-[spin_3s_linear_infinite_reverse]"></div>
        </div>
        <div className="absolute inset-6 [transform-style:preserve-3d]" style={{ transform: 'rotateX(70deg) rotateZ(45deg)' }}>
          <div className="w-full h-full rounded-full border-[3px] border-blue-500/80 border-l-transparent animate-[spin_2s_linear_infinite]"></div>
        </div>
      </div>
    );
  }

  // md
  return (
    <div className="relative w-12 h-12 [perspective:1000px]">
      <div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: 'rotateX(60deg) rotateY(20deg)' }}>
        <div className="w-full h-full rounded-full border-[2px] border-indigo-500/80 border-t-transparent animate-[spin_2.5s_linear_infinite]"></div>
      </div>
      <div className="absolute inset-1.5 [transform-style:preserve-3d]" style={{ transform: 'rotateX(30deg) rotateY(60deg)' }}>
        <div className="w-full h-full rounded-full border-[2px] border-purple-500/80 border-b-transparent animate-[spin_3s_linear_infinite_reverse]"></div>
      </div>
      <div className="absolute inset-3 [transform-style:preserve-3d]" style={{ transform: 'rotateX(70deg) rotateZ(45deg)' }}>
        <div className="w-full h-full rounded-full border-[2px] border-blue-500/80 border-l-transparent animate-[spin_2s_linear_infinite]"></div>
      </div>
    </div>
  );
}
