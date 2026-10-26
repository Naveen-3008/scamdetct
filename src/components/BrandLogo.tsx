import React from 'react';

interface BrandLogoProps {
  name: string;
  size?: 'sm' | 'md';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ name, size = 'md' }) => {
  const boxClass =
    size === 'sm'
      ? 'h-8 w-8 sm:h-9 sm:w-9 rounded-lg'
      : 'h-10 w-10 rounded-xl';
  const svgSize = size === 'sm' ? 20 : 24;
  const textClass =
    size === 'sm' ? 'text-lg sm:text-xl' : 'text-xl';

  return (
    <span className="inline-flex items-center gap-2 sm:gap-3 whitespace-nowrap shrink-0">
      <span
        className={`${boxClass} bg-teal-700 text-white inline-flex items-center justify-center shrink-0`}
        aria-hidden="true"
      >
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </span>
      <span className={`${textClass} font-bold tracking-tight text-slate-900`}>
        {name}
      </span>
    </span>
  );
};
