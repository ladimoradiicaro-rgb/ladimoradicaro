import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// Static site for Cloudflare Pages. build.format "file" emits scopri.html etc.,
// which Cloudflare serves at the clean URLs used in canonicals and the sitemap (/scopri).
export default defineConfig({
  site: "https://www.ladimoradicaro.com",
  integrations: [react()],
  build: { format: "file" },
  trailingSlash: "never",
});
