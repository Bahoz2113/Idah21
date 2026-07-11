const { tokens } = require("@cezeri/config");
module.exports = {
  content: ["./index.ts", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: { extend: { colors: {
    lacivert: tokens.colors.lacivert, mavi: tokens.colors.mavi, turkuaz: tokens.colors.turkuaz,
  } } },
  plugins: [],
};
