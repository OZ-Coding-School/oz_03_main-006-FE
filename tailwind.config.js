module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // 소스 파일 경로와 확장자 지정
    './public/index.html', // 필요한 경우 추가 경로 지정
  ],
  theme: {
    extend: {
      fontFamily: {
        okgung: ['OKGUNG', 'sans-serif'],
        chosun: ['ChosunCentennial', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-stroke-blue': {
          '-webkit-text-stroke': '2px #244C7C',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
