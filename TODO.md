
## TODO


MVP
    add voice viz
    add shadcn based ui with easy brand overrides
    add varying greeting texts
    add saving of transcriptions and recordings of conversations
----
    add some screener? or keep it panel side?

    add some sort of sampling capture (ie from Cint panels) and redirect back to panel

    at end of interview ask some contact details?
----
    add prompt generator to design proper prompts (based on cli for devs?)
        input from product interview sources
        use openai reference prompt


Some max session length limiter to avoid excess costs


Add some noise reduction worker & plugin (ie krisp or something open source)

Add some timeout if there too much silence from client side, disconnect and / or pause the session server side to not use openai tokens

On mobile, simplify the mic & speaker selection somehow?

Later


fix the bug with clientside tool use and server not allowing sessionupdates

- [ ] Add authentication to the relay endpoint
- [ ] Add rate limiting
- [ ] Add error handling and retries for WebSocket connections
- [ ] Add monitoring and logging
- [ ] Add tests
- [ ] Add documentation for deployment and configuration
- [ ] Add optional Sentry observability
- [ ] Add optional PostHog analytics