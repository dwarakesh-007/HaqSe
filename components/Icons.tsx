// Line icons in the HaqSe ink style. Stroke uses currentColor.

type P = { size?: number };
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

// Shopping bag with a returned-tag: consumer problems
export function ConsumerIcon({ size = 26 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
      <path d="M9.5 14.5l1.8 1.8 3.4-3.6" />
    </svg>
  );
}

// Phone with a warning mark: cyber fraud
export function CyberIcon({ size = 26 }: P) {
  return (
    <svg {...base(size)}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.2" />
      <path d="M12 8v4.5" />
      <path d="M12 15.5h.01" />
      <path d="M10.5 18.5h3" />
    </svg>
  );
}

// Document with a magnifier: right to information
export function RtiIcon({ size = 26 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
      <path d="M14 3l5 5h-5V3z" />
      <path d="M8 10h4M8 13.5h2.5" />
      <circle cx="16" cy="15.5" r="3" />
      <path d="M18.2 17.7L20.5 20" />
    </svg>
  );
}

export function PinIcon({ size = 16 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

export function ChevronRight({ size = 18 }: P) {
  return (
    <svg {...base(size)} strokeWidth={2}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export const AREA_ICONS = {
  consumer: ConsumerIcon,
  "cyber-fraud": CyberIcon,
  rti: RtiIcon,
};
