import type { SVGProps } from 'react';

export interface ForbiddenIllustrationProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export function ForbiddenIllustration({
  className = 'w-32 h-32',
  ...props
}: ForbiddenIllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <defs>
        {/* Soft Radial Ambient Glow */}
        <radialGradient
          id="forb-ambient-glow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(100 100) rotate(90) scale(85)"
        >
          <stop stopColor="#f43f5e" stopOpacity="0.25" />
          <stop offset="0.6" stopColor="#e11d48" stopOpacity="0.08" />
          <stop offset="1" stopColor="#881337" stopOpacity="0" />
        </radialGradient>

        {/* Shield Border Gradient */}
        <linearGradient id="forb-shield-stroke" x1="50" y1="20" x2="150" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fb7185" />
          <stop offset="0.5" stopColor="#e11d48" />
          <stop offset="1" stopColor="#4c0519" />
        </linearGradient>

        {/* Shield Body Fill Gradient */}
        <linearGradient id="forb-shield-fill" x1="100" y1="25" x2="100" y2="175" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffe4e6" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fecdd3" stopOpacity="0.4" />
        </linearGradient>

        {/* Dark Mode Shield Body Fill */}
        <linearGradient id="forb-shield-fill-dark" x1="100" y1="25" x2="100" y2="175" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e1b4b" stopOpacity="0.6" />
          <stop offset="1" stopColor="#881337" stopOpacity="0.4" />
        </linearGradient>

        {/* Lock Metal Shackle Gradient */}
        <linearGradient id="forb-shackle" x1="82" y1="55" x2="118" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fda4af" />
          <stop offset="0.4" stopColor="#fb7185" />
          <stop offset="1" stopColor="#9f1239" />
        </linearGradient>

        {/* Padlock Body Gradient */}
        <linearGradient id="forb-lock-body" x1="72" y1="88" x2="128" y2="148" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f43f5e" />
          <stop offset="0.6" stopColor="#e11d48" />
          <stop offset="1" stopColor="#be123c" />
        </linearGradient>

        {/* 403 Badge Gradient */}
        <linearGradient id="forb-badge" x1="68" y1="140" x2="132" y2="164" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e293b" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* 1. Ambient Glow Backing */}
      <circle cx="100" cy="100" r="85" fill="url(#forb-ambient-glow)" />

      {/* 2. Concentric Orbit Circles (Dashed security radar) */}
      <circle
        cx="100"
        cy="100"
        r="78"
        stroke="#f43f5e"
        strokeOpacity="0.2"
        strokeWidth="1.5"
        strokeDasharray="4 6"
      />
      <circle
        cx="100"
        cy="100"
        r="64"
        stroke="#f43f5e"
        strokeOpacity="0.15"
        strokeWidth="1"
      />

      {/* 3. Protective Shield Background */}
      <path
        d="M100 32C128 44 148 48 152 74C154 116 132 152 100 168C68 152 46 116 48 74C52 48 72 44 100 32Z"
        fill="url(#forb-shield-fill)"
        className="dark:hidden"
      />
      <path
        d="M100 32C128 44 148 48 152 74C154 116 132 152 100 168C68 152 46 116 48 74C52 48 72 44 100 32Z"
        fill="url(#forb-shield-fill-dark)"
        className="hidden dark:block"
      />
      <path
        d="M100 32C128 44 148 48 152 74C154 116 132 152 100 168C68 152 46 116 48 74C52 48 72 44 100 32Z"
        stroke="url(#forb-shield-stroke)"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* 4. Padlock Shackle */}
      <path
        d="M84 92V74C84 65.1634 91.1634 58 100 58C108.837 58 116 65.1634 116 74V92"
        stroke="url(#forb-shackle)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* 5. Padlock Body */}
      <rect
        x="74"
        y="90"
        width="52"
        height="44"
        rx="10"
        fill="url(#forb-lock-body)"
        stroke="#fda4af"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />

      {/* 6. Lock Inner Highlight / Keyhole */}
      <circle cx="100" cy="108" r="4.5" fill="#ffffff" />
      <path
        d="M98 109L96.5 121H103.5L102 109"
        fill="#ffffff"
      />

      {/* 7. Floating 403 Pill Badge */}
      <g filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25))">
        <rect
          x="72"
          y="142"
          width="56"
          height="22"
          rx="11"
          fill="url(#forb-badge)"
          stroke="#f43f5e"
          strokeWidth="1.5"
        />
        {/* Blinking red security dot */}
        <circle cx="82" cy="153" r="3" fill="#f43f5e" />
        <circle cx="82" cy="153" r="5" fill="#f43f5e" fillOpacity="0.3" />
        {/* 403 text */}
        <text
          x="104"
          y="157"
          fill="#ffffff"
          fontSize="11"
          fontWeight="bold"
          letterSpacing="0.08em"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          403
        </text>
      </g>

      {/* 8. Floating Cross/Diagonal Hazard Bars */}
      <circle cx="44" cy="52" r="3" fill="#fb7185" fillOpacity="0.7" />
      <circle cx="156" cy="52" r="3" fill="#fb7185" fillOpacity="0.7" />
      <circle cx="162" cy="120" r="2" fill="#fb7185" fillOpacity="0.5" />
      <circle cx="38" cy="120" r="2" fill="#fb7185" fillOpacity="0.5" />
    </svg>
  );
}

export default ForbiddenIllustration;
