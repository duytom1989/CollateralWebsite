/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vpbank: {
          // Authentic VPBank color palette
          primary: '#1D6161', // Dominant VPBank color - deep teal
          secondary: '#1D5961', // Darker variation
          accent: '#16BD5E', // VPBank green accent
          light: '#DDE4E6', // Light neutral background
          
          // VPBank palette colors
          'brown': '#735950', // VPBank brown
          'blue': '#7DA7BE', // VPBank blue
          'gold': '#92834F', // VPBank gold/khaki
          'green': '#16BD5E', // VPBank bright green
          'teal': '#1D6161', // Main teal (same as primary)
          'teal-dark': '#1D5961', // Dark teal
          
          // Variations for UI states
          'primary-hover': '#1D5961',
          'primary-light': '#DDE4E6',
          'green-hover': '#14A855',
          
          // Supporting colors
          success: '#16BD5E',
          warning: '#92834F',
          error: '#DC2626',
          info: '#7DA7BE',
          
          // Gray scale
          gray: {
            50: '#F7FAFC',
            100: '#EDF2F7',
            200: '#E2E8F0',
            300: '#CBD5E0',
            400: '#A0AEC0',
            500: '#718096',
            600: '#4A5568',
            700: '#2D3748',
            800: '#1A202C',
            900: '#171923',
          },
          
          // Navy variations
          navy: {
            50: '#EBF8FF',
            100: '#BEE3F8',
            200: '#90CDF4',
            300: '#63B3ED',
            400: '#4299E1',
            500: '#3182CE',
            600: '#2B77CB',
            700: '#2C5282',
            800: '#2A4365',
            900: '#1B365D',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'vpbank': '0 4px 14px 0 rgba(29, 97, 97, 0.1)',
        'vpbank-lg': '0 10px 25px -3px rgba(29, 97, 97, 0.1), 0 4px 6px -2px rgba(29, 97, 97, 0.05)',
        'vpbank-green': '0 4px 14px 0 rgba(22, 189, 94, 0.15)',
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 25px 0 rgba(0, 0, 0, 0.15)',
        'hard': '0 10px 40px 0 rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      screens: {
        'xs': '480px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}