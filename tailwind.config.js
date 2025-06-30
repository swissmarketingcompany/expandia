/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./dist/**/*.html",
    "./*.html"
  ],
  theme: {
    extend: {
      colors: {
        // Golden Buzz Palette
        'buzz-primary': '#f9c23c',
        'buzz-secondary': '#e86100',
        'buzz-accent': '#1fb2a6',
        'buzz-neutral': '#3d4451',
        'buzz-neutral-dark': '#2d3440',
        'buzz-warm': '#fff9e6',
        'buzz-light': '#f8fafc',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'buzz-gradient': 'linear-gradient(90deg, #FFA500 0%, #FFD700 100%)',
        'buzz-hero': 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #dc2626 100%)',
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(0)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(251, 191, 36, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'buzz': '0 25px 50px -12px rgba(251, 191, 36, 0.25)',
        'buzz-lg': '0 35px 60px -12px rgba(251, 191, 36, 0.4)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        bumblebee: {
          "primary": "#f9c23c",
          "secondary": "#e86100", 
          "accent": "#1fb2a6",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
          "base-200": "#f2f2f2",
          "base-300": "#e5e6e6",
          "base-content": "#1f2937",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        }
      }
    ],
    base: true,
    utils: true,
    logs: false,
    rtl: false,
  },
} 