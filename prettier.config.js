/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  singleQuote: true,
  semi: true,
  tabWidth: 2,
  trailingComma: 'all',
};

export default config;
