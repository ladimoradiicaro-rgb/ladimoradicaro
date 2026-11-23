import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

// Static site for Cloudflare Pages. build.format "file" emits scopri.html etc.,
// which Cloudflare serves at the clean URLs used in canonicals and the sitemap (/scopri).
export default defineConfig({
  site: "https://www.ladimoradicaro.com",
  // Preact with React compatibility: components keep importing from "react".
  integrations: [preact({ compat: true })],
  build: { format: "file" },
  trailingSlash: "never",
});
