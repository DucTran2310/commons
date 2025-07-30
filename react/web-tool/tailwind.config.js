module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          background: '#ffffff',
          text: '#1e293b',
          activeBg: '#f0f9ff',
          activeText: '#0ea5e9',
          hoverBg: '#f1f5f9',
          divider: '#e2e8f0',
          sectionHeader: '#64748b',
          chevron: '#475569',
          sidebarBg: '#ffffff',
        },
        // Dark mode colors
        dark: {
          background: '#1e293b',
          text: '#f8fafc',
          activeBg: '#334155',
          activeText: '#38bdf8',
          hoverBg: '#334155',
          divider: '#334155',
          sectionHeader: '#94a3b8',
          chevron: '#cbd5e1',
          sidebarBg: '#1a253e',
        }
      }
    },
  },
  plugins: [],
}