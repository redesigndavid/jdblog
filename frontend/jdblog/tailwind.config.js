module.exports = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100ch", // add required value here
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
