"use client";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="32" cy="32" r="30" fill="url(#logoGrad)" />

      {/* Left person silhouette */}
      <circle cx="22" cy="22" r="5" fill="white" opacity="0.9" />
      <path
        d="M14 38a8 8 0 0116 0"
        fill="white"
        opacity="0.9"
      />

      {/* Right person silhouette */}
      <circle cx="42" cy="22" r="5" fill="white" opacity="0.9" />
      <path
        d="M34 38a8 8 0 0116 0"
        fill="white"
        opacity="0.9"
      />

      {/* Equals / split symbol */}
      <rect x="24" y="44" width="16" height="3" rx="1.5" fill="white" opacity="0.85" />
      <rect x="24" y="50" width="16" height="3" rx="1.5" fill="white" opacity="0.85" />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}
