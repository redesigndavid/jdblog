import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import tailwindcss from "@tailwindcss/vite";

export default {
  plugins: [react(), vike(), tailwindcss()],
  resolve: {
    alias: {
      "@components": "/components",
      "@utils": "/utils",
    },
  },
  ssr: {
    // Add problematic npm package here:
    noExternal: ["dateformat"],
  },
};
