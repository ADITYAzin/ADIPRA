import React from 'react';

export function FigmaIcon({ className = 'size-4' }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M8 0h4v8H8a4 4 0 0 1-4-4 4 4 0 0 1 4-4z" fill="#F24E1E" />
      <path d="M12 0h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-4V0z" fill="#FF7262" />
      <path d="M8 8h4v8H8a4 4 0 0 1-4-4 4 4 0 0 1 4-4z" fill="#A259FF" />
      <path d="M16 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" fill="#1ABCFE" />
      <path d="M8 16h4v4a4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" fill="#0ACF83" />
    </svg>
  );
}

export default FigmaIcon;
