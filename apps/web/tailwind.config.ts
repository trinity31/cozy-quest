import type { Config } from 'tailwindcss';

// Cozy Quest Design System v2 (Watercolor + Ink)
// Tokens calibrated to the reference village illustration.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cream / paper family — sun-warmed parchment
        paper: {
          DEFAULT: '#F5E5B8',
          soft: '#FAEFC8',
          deep: '#EAD09A',
          edge: '#D9B973',
        },
        cobble: '#EAD9A8',
        // Caramel cat primary
        cat: {
          DEFAULT: '#E8945C',
          soft: '#F4B98A',
          deep: '#C97A3E',
        },
        // Sage (awning / vegetation)
        sage: {
          DEFAULT: '#A8C49A',
          deep: '#7BA084',
          mute: '#C2D2A8',
        },
        // Olive — warmer green
        olive: {
          DEFAULT: '#A6BC5C',
          deep: '#7E924A',
        },
        // Pink (flowers / sunset)
        pink: {
          DEFAULT: '#E8B4B8',
          deep: '#D88A8E',
        },
        // Honey (lantern / lamp glow)
        honey: {
          DEFAULT: '#E8C56C',
          deep: '#C9A248',
        },
        // Terracotta (roof tiles)
        terra: {
          DEFAULT: '#D96B47',
          soft: '#E89567',
          deep: '#A8492E',
        },
        teal: '#7BA89D',
        // Ink (hand-drawn line)
        ink: {
          DEFAULT: '#5C4128',
          soft: '#8B6240',
          faint: '#B69770',
        },
        // Text
        text: {
          DEFAULT: '#3A2B1C',
          soft: '#6E563E',
          faint: '#A88B68',
        },
      },
      fontFamily: {
        // Body — Korean-first
        sans: ['var(--font-pretendard)', 'Pretendard Variable', 'Pretendard', 'system-ui', 'sans-serif'],
        // Storybook display
        book: ['var(--font-gowun)', 'Gowun Dodum', 'serif'],
        // Handwritten accents
        mark: ['var(--font-caveat)', 'Caveat', 'cursive'],
        mono: ['ui-monospace', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // v2 type scale
        h1: ['28px', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        h2: ['20px', { lineHeight: '1.35', letterSpacing: '-0.005em' }],
        body: ['14px', { lineHeight: '1.55' }],
        cap: ['12px', { lineHeight: '1.5' }],
      },
      boxShadow: {
        // Warm paper drop — base offset + soft blur (single-direction ink tone)
        'paper-1': '0 1px 0 rgba(92,65,40,0.10), 0 3px 6px rgba(92,65,40,0.08)',
        'paper-2': '0 2px 0 rgba(92,65,40,0.12), 0 8px 18px rgba(92,65,40,0.14)',
        'paper-3': '0 4px 0 rgba(92,65,40,0.14), 0 20px 38px rgba(92,65,40,0.22)',
        // Ink-tinted solid offset (used on cards/buttons)
        'ink-1': '0 2px 0 #8B6240',
        'ink-2': '0 3px 0 #8B6240',
        'ink-3': '0 4px 0 #5C4128',
        // Cat-tinted solid offset for primary buttons
        'cat-1': '0 3px 0 #C97A3E',
        'cat-2': '0 4px 0 #C97A3E',
      },
      borderRadius: {
        card: '14px',
        modal: '18px',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { transform: 'scale(0.6) rotate(-12deg)', opacity: '0.2' },
          '50%': { transform: 'scale(1.1) rotate(12deg)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'toast-pop': {
          '0%': { transform: 'translateY(-8px) rotate(-2deg) scale(0.94)', opacity: '0' },
          '25%': { transform: 'translateY(0) rotate(-2deg) scale(1.02)', opacity: '1' },
          '75%': { transform: 'translateY(0) rotate(-2deg) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-4px) rotate(-2deg) scale(0.96)', opacity: '0' },
        },
      },
      animation: {
        sparkle: 'sparkle 1.6s ease-in-out infinite',
        'slide-up': 'slide-up 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'toast-pop': 'toast-pop 1400ms ease-out forwards',
      },
    },
  },
  plugins: [],
};
export default config;
