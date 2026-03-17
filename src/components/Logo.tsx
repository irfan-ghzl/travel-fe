interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 40, showText = true, className = '' }: LogoProps) {
  const iconSize = size;
  const fontSize = size * 0.55;

  return (
    <div className={`logo-wrapper ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pin shape */}
        <path
          d="M50 5C31.2 5 16 19.6 16 37.5C16 60 50 95 50 95C50 95 84 60 84 37.5C84 19.6 68.8 5 50 5Z"
          fill="#1a6b6a"
        />
        {/* Face circle */}
        <circle cx="50" cy="37" r="24" fill="white" />
        {/* Left eye */}
        <circle cx="40" cy="32" r="3.5" fill="#1a6b6a" />
        {/* Right eye */}
        <circle cx="60" cy="32" r="3.5" fill="#1a6b6a" />
        {/* Smile */}
        <path
          d="M38 42C38 42 43 50 50 50C57 50 62 42 62 42"
          stroke="#1a6b6a"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Orange accent dot */}
        <circle cx="72" cy="18" r="8" fill="#e8782a" />
      </svg>
      {showText && (
        <span style={{ fontSize: `${fontSize}px`, fontWeight: 700, letterSpacing: '-0.5px' }}>
          <span style={{ color: '#1a3c4a' }}>pin</span>
          <span style={{ color: '#1a6b6a' }}>tour</span>
        </span>
      )}
    </div>
  );
}
