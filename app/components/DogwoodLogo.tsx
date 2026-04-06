export default function DogwoodLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top petal */}
      <path d="M24 3 C28 9 28 15 24 18 C20 15 20 9 24 3Z" fill="#c1441a" />
      {/* Right petal */}
      <path d="M45 24 C39 28 33 28 30 24 C33 20 39 20 45 24Z" fill="#c1441a" />
      {/* Bottom petal */}
      <path d="M24 45 C20 39 20 33 24 30 C28 33 28 39 24 45Z" fill="#c1441a" />
      {/* Left petal */}
      <path d="M3 24 C9 20 15 20 18 24 C15 28 9 28 3 24Z" fill="#c1441a" />
      {/* Center disk */}
      <circle cx="24" cy="24" r="6.5" fill="#7c2206" />
      <circle cx="24" cy="24" r="3.5" fill="#fef3c7" />
      {/* Petal notches */}
      <path d="M24 3 L23 5 L24 7 L25 5Z" fill="#fff" opacity="0.25" />
      <path d="M45 24 L43 23 L41 24 L43 25Z" fill="#fff" opacity="0.25" />
      <path d="M24 45 L25 43 L24 41 L23 43Z" fill="#fff" opacity="0.25" />
      <path d="M3 24 L5 25 L7 24 L5 23Z" fill="#fff" opacity="0.25" />
    </svg>
  )
}
