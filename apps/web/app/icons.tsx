/**
 * Inline SVG 아이콘 — 이모지 대신 선명한 stroke 아이콘으로 가독성 확보.
 * 모두 currentColor stroke 사용 → 부모의 text-* 클래스로 색 제어.
 */

type IconProps = {
  className?: string;
  size?: number;
};

export function HomeIcon({ className, size = 22 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h4v-6h6v6h4V10" />
    </svg>
  );
}

export function SearchIcon({ className, size = 22 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="6.5" />
      <line x1="20.5" y1="20.5" x2="16" y2="16" />
    </svg>
  );
}
