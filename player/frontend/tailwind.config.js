/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        'outfit': ["Outfit", "sans-serif"],
      },

      borderRadius: {
        px_32: '2rem',
        px_30: '1.875rem',
        px_28: '1.75rem',
        px_20: '1.25rem',
      },

      fontSize: {
        '64': ['4rem', {
          lineHeight: '100%',
          letterSpacing: '0',
        }],
        '48': ['3rem', {
          lineHeight: '100%',
          letterSpacing: '0',
        }],
        '40': ['2.5rem', {
          lineHeight: '100%',
          letterSpacing: '0',
        }],
        '36': ['2.25rem', {
          lineHeight: '100%',
          letterSpacing: '0',
        }],
        '34': ['2.125rem', {
          lineHeight: '100%',
          letterSpacing: '0',
        }],
        '30': ['1.875rem', {
          lineHeight: '100%',
          letterSpacing: '0',
        }],
        '28': ['1.75rem', {
          lineHeight: '100%',
          letterSpacing: '0',
        }],
        '24': ['1.5rem', {
          lineHeight: '100%',
          letterSpacing: '0',
        }],
        '22': ['1.375rem', {
          lineHeight: '100%',
          letterSpacing: '0',
        }],
        '20': ['1.25rem', {
          lineHeight: '100%',
          letterSpacing: '0',
        }],
        '18': ['1.125rem', {
          lineHeight: '100%',
          letterSpacing: '0',
        }],
        '16': ['1rem', {
          lineHeight: '100%',
          letterSpacing: '0',
        }],
        '14': ['0.875rem', {
          lineHeight: '100%',
          letterSpacing: '0',
        }],
        '12': ['0.75rem', {
          lineHeight: '100%',
          letterSpacing: '0',
        }],
        '10': ['0.625rem', {
          lineHeight: '100%',
          letterSpacing: '0',
        }],
      },

      spacing: {
        'header-height': 'var(--lh-header-height)',
        'container-width': 'var(--lh-container-width)',
        'input-height': 'var(--lh-inputHeight)',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
      },


      colors: {
        background: 'var(--lh-background)',
        foreground: 'var(--lh-foreground)',
        white: "var(--lh-whiteColor)",
        black: "var(--lh-blackColor)",
        'primary-border': 'var(--lh-primary-border)',
        'secondary-border': 'var(--lh-secondary-border)',
        'tab-bg': 'var(--lh-tabs-bg)',
        'tab-text-color': 'var(--lh-tab-text-color)',
        'footer-bg': 'var(--lh-footer-bg)',
        'modal-overlay': 'var(--lh-modal-overlay)',
        'input-border': 'var(--lh-input-border)',
        'label-color': 'var(--lh-lable-color)',
        'placeholder-color': 'var(--lh-placeholder-color)',
        'input-bg': 'var(--lg-input-bg)',
        'success-btn-bg': 'var(--success-btn-bg)',

        whiteOpacity: {
          100: "var(--lh-whiteOpacity-100)",
          200: "var(--lh-whiteOpacity-200)",
          300: "var(--lh-whiteOpacity-300)",
        },

        blackOpacity: {
          100: "var(--lh-blackOpacity-100)",
        },

        primary: {
          50: "var(--lh-primary-50)",
          100: "var(--lh-primary-100)",
          200: "var(--lh-primary-200)",
          300: "var(--lh-primary-300)",
          400: "var(--lh-primary-400)",
          500: "var(--lh-primary-500)",
          600: "var(--lh-primary-600)",
        },

        secondary: {
          200: "var(--lh-secondary-200)",
          400: "var(--lh-secondary-400)",
          500: "var(--lh-secondary-500)",
          600: "var(--lh-secondary-600)",
        },

        tertiary: {
          100: "var(--lh-tertiary-100)",
          300: "var(--lh-tertiary-300)",
        },

        lightGray: {
          1: "rgba(199, 199, 199, 1)",
        },
      },

      // maxWidth: {
      //   mw406: "25.375rem",
      //   customMaxWidth: "calc(100% + 6px)",
      // },
      // marginTop: {
      //   marginTopMinus1: "3.563rem",
      // },
      // width: {
      //   customWidth: "calc(100% + 6px)",
      // },
      // marginTop: {
      //   marginTopMinus1: "3.563rem",
      // },

      backgroundImage: {
        // Gradient Color
        primaryButtonGradient: 'linear-gradient(180deg, #D4AF37 0%, #F4C430 100%)',
        borderGradient: 'linear-gradient(180deg, #F4C430 0%, #D4AF37 100%)',
        tabGradient: 'linear-gradient(360deg, rgba(212, 175, 55, 0.7) -117.21%, rgba(212, 175, 55, 0) 100%)',
        dividerLineGradient: 'linear-gradient(90deg, rgba(212, 175, 55, 0) 10.91%, #D4AF37 50.08%, rgba(212, 175, 55, 0) 89.24%)',
        dividerBgGradient: 'radial-gradient(109.47% 75.17% at 50.87% 3.93%, #4B3C3E 0%, rgba(75, 60, 62, 0) 22.75%)',
        rewardStripGradient: 'linear-gradient(90deg, #C5A17D 0%, #C18B55 100%)',
        heroTextGradient: 'linear-gradient(93.23deg, #D4AF37 53.4%, #F4C430 72.26%)',
        heroImgOverly: 'linear-gradient(180deg, rgba(28, 13, 10, 0) 13.04%, #160C0A 89.13%)',
        iconBgGradient: 'radial-gradient(50% 50% at 50% 50%, #48393B 0%, rgba(72, 57, 59, 0) 100%)',
        inputBordergradient:'linear-gradient(87.99deg, #EBDC03 -4.33%, #FF9321 21.23%, #FF9321 23.32%, #F24C50 47.31%, #8B21B7 100%)',


        // Background Image
        heroBgImg: 'url("/guest-lobby/hero-bg-img.webp")',
        rewardBg: 'url("/guest-lobby/reward-bg-img.webp")',
        starImg :'url("/guest-lobby/star-img.svg")',
        authBg :'url("/auth/auth-bg.jpg")',
        checkIcon: 'url("/auth/check-icon.svg")',
      },

      dropShadow: {
        custom: "0px 7.58333px 26px rgba(235, 220, 3, 0.6)",
        // checkboxShadow: "0 0 0.5rem rgba(26, 121, 70, 1)",
      },

      boxShadow: {
        "primaryBtnShadow": "0px 0px 12.69px 0px hsla(45, 75%, 45%, 0.5)",
        "slideShadow": "0px 0px 20.1px 0px #D4AF3799",
        'coinShadow': '0px 0px 12.69px 0px #D4AF3780',
        'inputShadow': '0px 0px 10px 0px hsla(201, 85%, 7%, 1) inset',
      },

      keyframes: {

        heroOneText: {
          "0%": { transform: "translateY(220%)" },
          "5%": { transform: "translateY(0%)" },
          "10%": { transform: "translateY(0%)" },
          "15%": { transform: "translateY(0%)" },
          "20%": { transform: "translateY(0%)" },
          "25%": { transform: "translateY(0%)" },
          "30%": { transform: "translateY(0%)" },
          "35%": { transform: "translateY(0%)" },
          "40%": { transform: "translateY(0%)" },
          "45%": { transform: "translateY(-0%)" },
          "47.5%": { transform: "translateY(220%)" },
        },

        heroTwoText: {
          "50%": { transform: "translateY(220%)" },
          "55%": { transform: "translateY(0%)" },
          "60%": { transform: "translateY(0%)" },
          "65%": { transform: "translateY(0%)" },
          "70%": { transform: "translateY(0%)" },
          "75%": { transform: "translateY(0%)" },
          "80%": { transform: "translateY(0%)" },
          "85%": { transform: "translateY(0%)" },
          "90%": { transform: "translateY(0%)" },
          "95%": { transform: "translateY(-0%)" },
          "100%": { transform: "translateY(220%)" },
        },

      },

      animation: {
        heroOneText: "heroOneText 5s linear 0s infinite ",
        // heroTwoText: "heroTwoText 5s linear 0s infinite",
      },

      screens: {
        lxl: "1921px",
        // => @media (min-width: 1921px) { ... }

        xlg: "1400px",
        // => @media (min-width: 992px) { ... }

        nlg: "900px",
        // => @media (min-width: 900px) { ... }

        mxs: "576px",
        // => @media (min-width: 576px) { ... }

        xxm: "420px",
        // => @media (min-width: 420px) { ... }

        xxs: "400px",
        // => @media (min-width: 400px) { ... }
      },
    },
  },
  plugins: [],
};
