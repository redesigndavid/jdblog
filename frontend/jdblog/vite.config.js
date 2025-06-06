import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@qalisa/vike-plugin-sitemap";

export default {
  plugins: [
    react(),
    vike(),
    tailwindcss(),
    sitemap({ baseUrl: "https://redesigndavid.com" }),
  ],
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
