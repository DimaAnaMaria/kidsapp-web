module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#F7F3EE',
        card: '#FFFFFF',
        border: '#E4DDD4',
        primary: '#1A1108',
        textSecondary: '#6B6058',
        sportiv: { bg: '#FFF3EE', text: '#C44A1A' },
        artist:  { bg: '#FAF0FF', text: '#7A28A8' },
        pragmatic: { bg: '#F0FBF6', text: '#0A7A51' },
        tehnic:  { bg: '#EEF5FF', text: '#1255A0' },
        sociabil: { bg: '#FFFBEE', text: '#987000' },
      },
      fontFamily: {
        sans: ['-apple-system', 'Segoe UI', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
