/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./stylesheets/**/*.{js,jsx,ts,tsx}", // Add this line!
    "./util/**/*.{js,jsx,ts,tsx}", // Add this line!
    "./src/**/*.{js,jsx,ts,tsx}"      // Add this if you have other folders
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}