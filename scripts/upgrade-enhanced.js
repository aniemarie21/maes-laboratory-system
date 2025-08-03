const fs = require("fs")
const path = require("path")

console.log("🚀 Starting MAES Laboratory Enhancement Upgrade...\n")

// Enhanced Tailwind configuration
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#0066cc',
          700: '#0052a3',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}`

// VS Code settings for optimal development
const vscodeSettings = {
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.includeLanguages": {
    typescript: "typescript",
    typescriptreact: "typescriptreact",
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx$$([^)]*)$$", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["className\\s*=\\s*['\"`]([^'\"`]*)['\"`]", "([a-zA-Z0-9\\-:]+)"],
  ],
  "files.associations": {
    "*.css": "tailwindcss",
  },
}

// Prettier configuration
const prettierConfig = {
  semi: false,
  trailingComma: "es5",
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  plugins: ["prettier-plugin-tailwindcss"],
}

// ESLint configuration
const eslintConfig = {
  extends: ["next/core-web-vitals", "prettier"],
  rules: {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off",
    "prefer-const": "error",
    "no-unused-vars": "warn",
  },
}

// Create configuration files
const createConfigFiles = () => {
  console.log("📝 Creating configuration files...")

  // Tailwind config
  fs.writeFileSync(path.join(process.cwd(), "tailwind.config.js"), tailwindConfig)
  console.log("   ✅ tailwind.config.js updated")

  // VS Code settings
  const vscodeDir = path.join(process.cwd(), ".vscode")
  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir)
  }

  fs.writeFileSync(path.join(vscodeDir, "settings.json"), JSON.stringify(vscodeSettings, null, 2))
  console.log("   ✅ .vscode/settings.json created")

  // Prettier config
  fs.writeFileSync(path.join(process.cwd(), ".prettierrc"), JSON.stringify(prettierConfig, null, 2))
  console.log("   ✅ .prettierrc created")

  // ESLint config
  fs.writeFileSync(path.join(process.cwd(), ".eslintrc.json"), JSON.stringify(eslintConfig, null, 2))
  console.log("   ✅ .eslintrc.json updated")
}

// Create enhanced component templates
const createEnhancedComponents = () => {
  console.log("\n🎨 Creating enhanced UI components...")

  const componentsDir = path.join(process.cwd(), "components", "ui")
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true })
  }

  // Enhanced Button component
  const buttonComponent = `import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg hover:from-primary-700 hover:to-primary-800 hover:shadow-xl focus:ring-primary-500': variant === 'primary',
            'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500': variant === 'secondary',
            'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500': variant === 'outline',
            'text-primary-600 hover:bg-primary-50 focus:ring-primary-500': variant === 'ghost',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'`

  fs.writeFileSync(path.join(componentsDir, "button.tsx"), buttonComponent)
  console.log("   ✅ Enhanced Button component created")

  // Enhanced Card component
  const cardComponent = `import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'floating'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-xl border transition-all duration-300',
          {
            'bg-white border-gray-200 shadow-sm hover:shadow-md': variant === 'default',
            'bg-white/80 backdrop-blur-lg border-white/20 shadow-glass': variant === 'glass',
            'bg-white border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-1': variant === 'floating',
            'p-0': padding === 'none',
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx('flex flex-col space-y-1.5 pb-6', className)} {...props} />
  )
)

CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={clsx('font-display text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
  )
)

CardTitle.displayName = 'CardTitle'

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx('pt-0', className)} {...props} />
  )
)

CardContent.displayName = 'CardContent'`

  fs.writeFileSync(path.join(componentsDir, "card.tsx"), cardComponent)
  console.log("   ✅ Enhanced Card component created")
}

// Create enhanced pages
const createEnhancedPages = () => {
  console.log("\n📄 Creating enhanced page templates...")

  // Enhanced loading component
  const loadingComponent = `export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-2">Loading MAES Laboratory</h2>
        <p className="text-gray-600">Please wait while we prepare your experience...</p>
      </div>
    </div>
  )
}`

  fs.writeFileSync(path.join(process.cwd(), "app", "loading.tsx"), loadingComponent)
  console.log("   ✅ Enhanced loading page created")
}

// Run enhancement
const runEnhancement = () => {
  try {
    createConfigFiles()
    createEnhancedComponents()
    createEnhancedPages()

    console.log("\n🎉 Enhancement completed successfully!")
    console.log("\n📊 Summary of enhancements:")
    console.log("   • Modern Tailwind configuration with custom colors")
    console.log("   • VS Code optimized settings")
    console.log("   • Enhanced UI components (Button, Card)")
    console.log("   • Improved loading states")
    console.log("   • Glass morphism and floating effects")
    console.log("   • Smooth animations and transitions")
    console.log("\n🚀 Next steps:")
    console.log("   1. Run: npm run dev")
    console.log("   2. Open: http://localhost:3000")
    console.log("   3. Enjoy your enhanced MAES Laboratory system!")
  } catch (error) {
    console.error("❌ Enhancement failed:", error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  runEnhancement()
}

module.exports = { runEnhancement }
