import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import type { ViteDevServer } from 'vite';

declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  server: {
    port: 5173,
    //Remap HMR to another port so we could accept websocket connections
    hmr: {
      port: 5174
    },
    //TODO: Remove this in the future when vite has cf env and supports websockets
    //Proxy the websockets to the wrangler based server that has proper env to run it
    proxy: {
      '/relay': {
        target: 'ws://localhost:8788',
        ws: true,
        rewriteWsOrigin: true,
      },
    }
  },
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
        unstable_optimizeDeps: true,
        unstable_routeConfig: true,
      },
    }),
    tsconfigPaths(),
  ],
  
});
