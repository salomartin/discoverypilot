// Copyright (c) 2024 Cloudflare, Inc.
// Licensed under the MIT license found in the LICENSE file or at https://opensource.org/licenses/MIT

import { RealtimeClient } from "@openai/realtime-api-beta";
import { BASE_INSTRUCTIONS } from "content/prompts";
import { SERVER_TOOLS } from "content/tools";

const DEBUG = true; // set as true to see debug logs
const MODEL = "gpt-4o-realtime-preview-2024-10-01";
const OPENAI_URL = "wss://api.openai.com/v1/realtime";


function owrLog(...args: unknown[]) {
  if (DEBUG) {
    console.log(...args);
  }
}

function owrError(...args: unknown[]) {
  console.error(...args);
}

export async function createRealtimeClient(request: Request, apiKey: string) {
  const [clientSocket, serverSocket] = Object.values(new WebSocketPair());

  serverSocket.accept();

  // Copy protocol headers
  const responseHeaders = new Headers();
  const protocolHeader = request.headers.get("Sec-WebSocket-Protocol");
  if (protocolHeader) {
    const requestedProtocols = protocolHeader.split(",").map((p) => p.trim());
    if (requestedProtocols.includes("realtime")) {
      responseHeaders.set("Sec-WebSocket-Protocol", "realtime");
    }
  }

  if (!apiKey) {
    owrError(
      "Missing OpenAI API key. Did you forget to set OPENAI_API_KEY in .dev.vars (for local dev) or with wrangler secret put OPENAI_API_KEY (for production)?"
    );
    return new Response("Missing API key", { status: 401 });
  }

  let realtimeClient: RealtimeClient | null = null;

  // Create RealtimeClient
  try {
    owrLog("Creating OpenAI RealtimeClient");
    realtimeClient = new RealtimeClient({
      apiKey,
      debug: false,
      url: OPENAI_URL,
    });

    owrLog("Updating session settings...");
   
    await realtimeClient.updateSession({
      voice: 'ash',
      instructions: BASE_INSTRUCTIONS,
      input_audio_transcription: { model: 'whisper-1' },
      turn_detection: {
        type: 'server_vad',
      },
      // Add any additional server-side session configurations here
    });

    owrLog("Session updated successfully.");

    // Add server-side tools
    /*
    SERVER_TOOLS.forEach(tool => {
      realtimeClient?.addTool(tool.schema, tool.fn);
    });*/

    owrLog("Connecting to OpenAI Realtime API...");

    // @ts-expect-error Waiting on https://github.com/openai/openai-realtime-api-beta/pull/52
    await realtimeClient.connect({ model: MODEL });
    owrLog("Connected to OpenAI successfully!");

    owrLog("Sending initial 'Hello!' message to OpenAI...");
    await realtimeClient.sendUserMessageContent([
      {
        type: 'input_text',
        text: 'Hello!',
      },
    ]);
    owrLog("Initial message sent successfully.");
    // Relay: OpenAI Realtime API Event -> Client
    realtimeClient.realtime.on("server.*", (event: { type: string, delta?: string }) => {
      const logEvent = event.delta ? { ...event, delta: event.delta.length } : event;
      owrLog("Relaying server event to client:", logEvent);
      serverSocket.send(JSON.stringify(event));
    });

    realtimeClient.realtime.on("close", (metadata: { error: boolean }) => {
      owrLog(
        `Closing server-side because I received a close event: (error: ${metadata.error})`
      );
      serverSocket.close();
    });

    // Relay: Client -> OpenAI Realtime API Event
    const messageQueue: string[] = [];

    serverSocket.addEventListener("message", (event: MessageEvent) => {
      const messageHandler = (data: string) => {
        try {
          const parsedEvent = JSON.parse(data);

          // Ignore session.update messages from the client
          if (parsedEvent.type === "session.update") {
            owrLog("Ignoring client-sent session.update message");
            return;
          }

          // Relay other messages to the RealtimeClient
          realtimeClient?.realtime.send(parsedEvent.type, parsedEvent);
          owrLog(
            "Received message from client:",
            parsedEvent.type === "input_audio_buffer.append"
              ? { ...parsedEvent, audio: parsedEvent.audio.length }
              : parsedEvent
          );
        } catch (e) {
          owrError("Error parsing event from client", data);
        }
      };

      const data =
        typeof event.data === "string" ? event.data : event.data.toString();
      if (!realtimeClient?.isConnected()) {
        messageQueue.push(data);
        owrLog("Queued message until connected:", data);
      } else {
        messageHandler(data);
      }
    });

    serverSocket.addEventListener("close", ({ code, reason }) => {
      owrLog(
        `Closing server-side because the client closed the connection: ${code} ${reason}`
      );
      realtimeClient?.disconnect();
      messageQueue.length = 0;
    });

    // Process any messages that were queued before connection was established
    while (messageQueue.length) {
      const message = messageQueue.shift();
      if (message) {
        serverSocket.send(message);
        owrLog("Sent queued message to client:", message);
      }
    }
  } catch (e) {
    owrError("Error connecting to OpenAI", e);
    return new Response("Error connecting to OpenAI", { status: 500 });
  }

  return new Response(null, {
    status: 101,
    headers: responseHeaders,
    webSocket: clientSocket,
  });
}

// Export a Pages function that handles the WebSocket upgrade
export const onRequest = async (context: {
  request: Request;
  env: { OPENAI_API_KEY: string };
}) => {
  const { request, env } = context;
  return createRealtimeClient(request, env.OPENAI_API_KEY);
};