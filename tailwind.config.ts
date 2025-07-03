
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
				// Polices spécialisées pour l'arabe
				'arabic-body': ['IBM Plex Sans Arabic', 'Noto Sans Arabic', 'Segoe UI', 'system-ui', 'sans-serif'],
				'arabic-heading': ['IBM Plex Sans Arabic', 'Amiri', 'Traditional Arabic', 'serif'],
				'arabic-elegant': ['Amiri', 'Traditional Arabic', 'Times New Roman', 'serif'],
			},
			fontSize: {
				// Échelle typographique fluide
				'fluid-xs': 'clamp(0.75rem, 1.5vw, 0.875rem)',
				'fluid-sm': 'clamp(0.875rem, 2vw, 1rem)',
				'fluid-base': 'clamp(1rem, 2.5vw, 1.125rem)',
				'fluid-lg': 'clamp(1.125rem, 3vw, 1.25rem)',
				'fluid-xl': 'clamp(1.25rem, 3.5vw, 1.5rem)',
				'fluid-2xl': 'clamp(1.5rem, 4vw, 1.875rem)',
				'fluid-3xl': 'clamp(1.875rem, 5vw, 2.25rem)',
				'fluid-4xl': 'clamp(2.25rem, 6vw, 3rem)',
			},
			lineHeight: {
				'arabic': '1.75', // Hauteur de ligne optimisée pour l'arabe
				'arabic-tight': '1.5',
				'arabic-relaxed': '1.9',
			},
			letterSpacing: {
				'arabic': '0.025em', // Espacement optimal pour l'arabe
				'arabic-wide': '0.05em',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom gradient colors
				violet: {
					50: '#f5f3ff',
					100: '#ede9fe',
					200: '#ddd6fe',
					300: '#c4b5fd',
					400: '#a78bfa',
					500: '#8b5cf6',
					600: '#7c3aed',
					700: '#6d28d9',
					800: '#5b21b6',
					900: '#4c1d95',
				},
				emerald: {
					50: '#ecfdf5',
					100: '#d1fae5',
					200: '#a7f3d0',
					300: '#6ee7b7',
					400: '#34d399',
					500: '#10b981',
					600: '#059669',
					700: '#047857',
					800: '#065f46',
					900: '#064e3b',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'gradient-shift': {
					'0%, 100%': {
						'background-position': '0% 50%'
					},
					'50%': {
						'background-position': '100% 50%'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gradient-shift': 'gradient-shift 6s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite'
			},
			backgroundSize: {
				'300%': '300%',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
