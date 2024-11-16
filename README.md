# Welcome to Discoverypilot

- 📖 [Remix docs](https://remix.run/docs)
- 📖 [Remix Cloudflare docs](https://remix.run/guides/vite#cloudflare)
- 📖 [Cloudflare Relay](https://github.com/cloudflare/openai-workers-relay)
- 
## Development


Copy `.dev.vars.example` to `.dev.vars` and set the OpenAI API key.

Run the dev server, which runs both vite and wrangler servers in dev mode. You could use wrangler only but then you lose vite dev mode advantages like HMR etc, hence the duality. It's due to the fact that vite currently doesn't support websockets, nor cloudflare worker environment fully natively. TODO: Improve this as soon as vite supports it. 

Note that the websocket proxy of vite is running on a fixed port 5174 (ie +1 of 5173, the vite default) so if there's something running on it, you'll get an error.

```sh
bun run dev
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
bun run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Deployment

First, build your app for production:

```sh
bun run build
```

Set the OpenAI API key secret for production:

```sh
bunx wrangler secret put OPENAI_API_KEY
```

Then, deploy your app to Cloudflare Pages:

```sh
bun run deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

## Based on 


## TODO
- [ ] Add authentication to the relay endpoint
- [ ] Add rate limiting
- [ ] Add error handling and retries for WebSocket connections
- [ ] Add monitoring and logging
- [ ] Add tests
- [ ] Add documentation for deployment and configuration
- [ ] Add optional Sentry observability
- [ ] Add optional PostHog analytics