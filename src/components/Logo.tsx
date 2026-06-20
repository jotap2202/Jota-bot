export function Logo({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Jota Bot"
    >
      {/* Shield */}
      <path
        d="M32 3 56 11V31C56 47 45 57 32 61C19 57 8 47 8 31V11L32 3Z"
        fill="#0e2a5e"
        stroke="#d8b44a"
        strokeWidth="2.5"
      />
      <path
        d="M32 9 50 15V31C50 43.5 41.5 51.5 32 55C22.5 51.5 14 43.5 14 31V15L32 9Z"
        stroke="#d8b44a"
        strokeWidth="1.5"
        opacity="0.5"
      />
      {/* Letter J */}
      <path
        d="M38 20H42V36C42 41 38.5 44 33.5 44C29 44 25.5 41.5 25 37H29C29.3 39 31 40.2 33.3 40.2C36 40.2 38 38.5 38 35.5V20Z"
        fill="#d8b44a"
      />
    </svg>
  );
}
