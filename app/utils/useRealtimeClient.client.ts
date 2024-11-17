import React, { useEffect, useRef, useState, useCallback } from "react";
import { RealtimeClient } from "@openai/realtime-api-beta";
import { WavRecorder } from "wavtools";
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client";

/**
 * Type for all event logs
 */
export interface RealtimeEvent {
  time: string;
  source: "client" | "server";
  count?: number;
  event: {
    event_id?: string;
    type?: string;
    [key: string]: any;
  };
}

interface ConversationItem {
  id: string;
  status: string;
  formatted: {
    audio?: ArrayBuffer;
    file?: any;
  };
}

interface ServerCloseEvent {
  error: boolean;
  type: "close";
}

interface ServerErrorEvent {
  type: "error";
  message: string;
}

export function useRealtimeClient(
  startTimeRef: React.MutableRefObject<string>,
  setRealtimeEvents: React.Dispatch<React.SetStateAction<RealtimeEvent[]>>,
  wavStreamPlayerRef: React.RefObject<any>,
  wavRecorderRef: React.RefObject<any>,
  tools?: [{ schema: any; fn: any }],
  onDisconnect?: (isManualDisconnect: boolean) => void
) {
  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient({
      url: "http://localhost:5173/relay",
      debug: true,
    })
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [items, setItems] = useState<ItemType[]>([]);
  const isDisconnecting = useRef(false);
  const isManualDisconnectRef = useRef(false);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleDisconnection = useCallback(
    async (isManualDisconnect = false) => {
      // Check the manual disconnect flag
      const wasManualDisconnect = isManualDisconnectRef.current;
      isManualDisconnectRef.current = false;  // Reset the flag

      // Prevent duplicate disconnection handling
      if (isDisconnecting.current) return;
      isDisconnecting.current = true;

      console.log("Handling disconnection...");

      try {
        // Full cleanup of WavRecorder instance
        if (wavRecorderRef.current) {
          if (wavRecorderRef.current.processor) {
            await wavRecorderRef.current.quit();
          } else {
            const stream = wavRecorderRef.current.stream;
            if (stream) {
              stream
                .getTracks()
                .forEach((track: MediaStreamTrack) => track.stop());
            }
          }
        }

        // Stop audio playback and clean up audio context
        if (wavStreamPlayerRef.current) {
          try {
            await wavStreamPlayerRef.current.interrupt();
            if (wavStreamPlayerRef.current.context) {
              await wavStreamPlayerRef.current.context.close();
              wavStreamPlayerRef.current.context = null;
            }
            if (wavStreamPlayerRef.current.analyser) {
              wavStreamPlayerRef.current.analyser.disconnect();
              wavStreamPlayerRef.current.analyser = null;
            }
            if (wavStreamPlayerRef.current.stream) {
              wavStreamPlayerRef.current.stream.disconnect();
              wavStreamPlayerRef.current.stream = null;
            }
          } catch (e) {
            console.warn("Error cleaning up WavStreamPlayer:", e);
          }
        }

        setIsConnected(false);
        setIsConnecting(false);
        setItems([]);

        // Only add the event if it wasn't a manual disconnect
        if (!wasManualDisconnect) {
          setRealtimeEvents((prev) => [
            ...prev,
            {
              time: new Date().toISOString(),
              source: "client",
              event: {
                type: "connection.closed",
                message: "Connection to voice service ended",
                status: "disconnected",
              },
            },
          ]);
        }

        // Let UI decide how to handle different types of disconnections
        onDisconnect?.(wasManualDisconnect);
      } catch (error) {
        console.error("Error during disconnection cleanup:", error);
      } finally {
        isDisconnecting.current = false;
      }
    },
    [setRealtimeEvents, onDisconnect]
  );

  const disconnectConversation = useCallback(async () => {
    if (clientRef.current?.isConnected?.()) {
      isManualDisconnectRef.current = true;  // Set flag before disconnecting
      await clientRef.current.disconnect();
    }
  }, []);

  const connect = useCallback(async () => {
    const client = clientRef.current;

    if (!client) {
      throw new Error("Voice client not initialized");
    }

    try {
      // Reacquire audio devices
      if (wavStreamPlayerRef.current) {
        await wavStreamPlayerRef.current.connect();
      }

      if (!client?.isConnected?.()) {
        await client.connect();
      }
      setIsConnected(true);
      setItems(client.conversation.getItems());
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Voice service connection failed: ${error.message}`
          : "Failed to establish connection with voice service"
      );
    }
  }, []);

  const handleAudioRecord = useCallback(
    (data: { mono: ArrayBuffer }) => {
      if (clientRef.current?.isConnected?.() && !isMuted) {
        clientRef.current.appendInputAudio(data.mono);
      }
    },
    [isMuted]
  );

  const connectConversation = useCallback(async () => {
    try {
      setIsConnecting(true);
      startTimeRef.current = new Date().toISOString();
      await connect();

      if (clientRef.current?.isConnected?.()) {
        setRealtimeEvents([]);
        setItems(clientRef.current.conversation.getItems());

        // Reacquire audio devices in sequence
        await wavStreamPlayerRef.current?.connect();
        await wavRecorderRef.current?.begin();
        await wavRecorderRef.current?.record(handleAudioRecord);
      }
    } catch (error) {
      setIsConnected(false);
      setIsConnecting(false);
      setItems([]);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [connect, handleAudioRecord, setRealtimeEvents, startTimeRef]);

  // Memoize event handlers to prevent recreation on each render
  const handleRealtimeEvent = useCallback(
    (event: RealtimeEvent) => {
      console.log("Realtime Event Received:", event);

      if (event.source === "server") {
        const allowedServerEvents = [
          "conversation.item.input_audio_transcription.completed",
          "response.audio_transcript.done",
          "response.cancel",
          "response.function_call_arguments.done",
        ];

        if (!allowedServerEvents.includes(event.event.type || "")) {
          return;
        }
      }

      if (event.event.type === "input_audio_buffer.append") {
        return;
      }

      if (
        event.event.type ===
        "conversation.item.input_audio_transcription.completed"
      ) {
        event.source = "client";
      }

      setRealtimeEvents((prev) => [...prev, event]);
    },
    [setRealtimeEvents]
  );

  const handleConversationUpdate = useCallback(
    async ({
      item,
      delta,
    }: {
      item: ConversationItem;
      delta: { audio?: ArrayBuffer };
    }) => {
      console.log("Conversation Updated:", { item, delta });
      const client = clientRef.current;
      const items = client.conversation.getItems();

      if (delta?.audio) {
        wavStreamPlayerRef.current?.add16BitPCM(delta.audio, item.id);
      }

      if (item.status === "completed" && item.formatted.audio?.byteLength) {
        try {
          const wavFile = await WavRecorder.decode(
            item.formatted.audio,
            24000,
            24000
          );
          item.formatted.file = wavFile;
        } catch (error) {
          console.error("Error decoding audio:", error);
        }
      }

      setItems(items);
    },
    []
  );

  const handleConversationInterrupt = useCallback(async () => {
    console.log("Conversation Interrupted");
    const trackSampleOffset = await wavStreamPlayerRef.current?.interrupt();
    if (trackSampleOffset?.trackId) {
      const { trackId, offset } = trackSampleOffset;
      await clientRef.current.cancelResponse(trackId, offset);
    }
  }, []);

  const handleConnectionEvents = useCallback(
    async (event: ServerCloseEvent | ServerErrorEvent) => {
      console.error("WebSocket connection event:", event);

      if (event.type === "close" && event.error) {
        try {
          const client = clientRef.current;
          await client.reset();
          await client.connect();
          console.log("Successfully reconnected");
        } catch (error) {
          console.error("Failed to reconnect:", error);
          await handleDisconnection(false);
        }
      } else {
        await handleDisconnection(false);
      }
    },
    [handleDisconnection]
  );

  // Set up event listeners
  useEffect(() => {
    const client = clientRef.current;

    client.on("realtime.event", handleRealtimeEvent);
    client.on("conversation.updated", handleConversationUpdate);
    client.on("conversation.interrupted", handleConversationInterrupt);
    client.realtime.on("close", handleConnectionEvents);
    client.realtime.on("error", handleConnectionEvents);

    // Cleanup function to remove event listeners
    return () => {
      client.off("error");
      client.off("realtime.event");
      client.off("conversation.updated");
      client.off("conversation.interrupted");
      client.off("connection.state");
      client.realtime.off("close");
      client.realtime.off("error");
    };
  }, [
    handleRealtimeEvent,
    handleConversationUpdate,
    handleConversationInterrupt,
    handleConnectionEvents,
  ]);

  const setMuted = useCallback(
    async (muted: boolean) => {
      setIsMuted(muted);
      if (muted) {
        await wavRecorderRef.current?.end();
      } else {
        await wavRecorderRef.current?.begin();
        await wavRecorderRef.current?.record(handleAudioRecord);
      }
    },
    [handleAudioRecord]
  );

  return {
    client: clientRef.current,
    isConnected,
    isConnecting,
    isMuted,
    setIsMuted: setMuted,
    items,
    connectConversation,
    disconnectConversation,
  };
}
