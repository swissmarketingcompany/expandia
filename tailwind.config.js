/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./dist/**/*.html",
    "./templates/**/*.html",
    "./blog/**/*.html",
    "./*.html"
  ],
  theme: {
    extend: {
      colors: {
        // Golden Buzz Palette
        'buzz-primary': '#cb102c',
        'buzz-secondary': '#a30d24',
        'buzz-accent': '#cb102c',
        'buzz-neutral': '#3d4451',
        'buzz-neutral-dark': '#2d3440',
        'buzz-warm': '#fff9e6',
        'buzz-light': '#f8fafc',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'buzz-gradient': 'linear-gradient(90deg, #cb102c 0%, #dc2626 100%)',
        'buzz-hero': 'linear-gradient(135deg, #991b1b 0%, #cb102c 50%, #dc2626 100%)',
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
          "primary": "#cb102c",
          "secondary": "#cb102c",
          "accent": "#cb102c",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
          "base-200": "#f2f2f2",
          "base-300": "#e5e6e6",
          "base-content": "#1f2937",
          "info": "#cb102c",
          "success": "#cb102c",
          "warning": "#cb102c",
          "error": "#cb102c",
        }
      }
    ],
    base: true,
    utils: true,
    logs: false,
    rtl: false,
  },
} 
