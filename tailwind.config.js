module.exports = {
  content: [
    "./index.html", // Adiciona o index.html
    "./src/**/*.{js,ts,jsx,tsx}", // Mapeia os arquivos JSX/TSX
  ],
  theme: {
    extend: {
      fontFamily: {
        calibri: ["'Calibri'", "sans-serif"],
      },
      fontSize: {
        base: "18px", // Aumente o tamanho base
      },
      colors: {
        gray: {
          //develop:
          950: "rgb(34, 34, 34)", // Cor do texto
          900: "rgb(55, 55, 55)",
          800: "rgb(76, 76, 76)", // Background do body
          700: "rgb(97, 97, 97)", // Background do container e form-control
          600: "rgb(118, 118, 118)",
          500: "rgb(139, 139, 139)",
          400: "rgb(160, 160, 160)",
          300: "rgb(181, 181, 181)",
          200: "rgb(202, 202, 202)", // Cor do placeholder
          100: "rgb(223, 223, 223)", // Cor do texto
          50: "rgb(244, 244, 244)", // Cor do texto secundário
          //preview:
          // 900: "rgb(28, 70, 47)",
          // 800: "rgb(41, 96, 65)", // Background do body
          // 700: "rgb(54, 122, 82)", // Background do container e form-control
          // 600: "rgb(68, 149, 100)",
          // 500: "rgb(94, 168, 121)",
          // 400: "rgb(129, 188, 149)",
        },
        orange: {
          400: "rgb(250, 169, 84)", // Cor principal dos botões
          200: "rgb(255, 215, 143)", // Cor do hover dos botões
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      spacing: {
        128: "30rem",
      },
      borderRadius: {
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
