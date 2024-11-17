import { useEffect, useRef, useState } from "react";
import type { RealtimeEvent } from "../utils/useRealtimeClient.client";
import { useRealtimeClient } from "../utils/useRealtimeClient.client";
import { WavRecorder, WavStreamPlayer } from "wavtools";
import { VoiceVisualizer } from "./VoiceVisualizer";
import { motion, AnimatePresence } from "framer-motion";
import { AudioLines, Loader2, X, Mic, MicOff } from "lucide-react";
import { AGENT_INFO } from "content/frontend";
import { Button } from "./ui/button";
import { RealtimeEventsDisplay } from "./RealtimeEventsDisplay";

const STORAGE_KEY = "voice_client_memory";

interface VoiceClientProps {
  onConnectionChange: (isConnected: boolean) => void;
}

export default function VoiceClient({ onConnectionChange }: VoiceClientProps) {
  const startTimeRef = useRef<string>(new Date().toISOString());
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [memoryKv, setMemoryKv] = useState<{ [key: string]: any }>(() => {
    if (typeof window === "undefined") return {};
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          todaysDate: new Date().toISOString().split("T")[0],
        };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryKv));
    }
  }, [memoryKv]);

  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000 })
  );
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000 })
  );

  const {
    client,
    isConnected,
    isConnecting,
    isMuted,
    setIsMuted,
    connectConversation,
    disconnectConversation,
  } = useRealtimeClient(
    startTimeRef,
    setRealtimeEvents,
    wavStreamPlayerRef,
    wavRecorderRef,
    [
      {
        schema: {
          name: "set_memory",
          description:
            "Saves important data about the user into memory. If keys are close, prefer overwriting keys rather than creating new keys.",
          parameters: {
            type: "object",
            properties: {
              key: {
                type: "string",
                description:
                  "The key of the memory value. Always use lowercase and underscores, no other characters.",
              },
              value: {
                type: "string",
                description: "Value can be anything represented as a string",
              },
            },
            required: ["key", "value"],
          },
        },
        async fn({ key, value }: { key: string; value: string }) {
          setMemoryKv((prev) => ({ ...prev, [key]: value }));
        },
      },
    ]
  );

  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleConnectionToggle = async () => {
    try {
      setConnectionError(null);
      if (isConnected) {
        await disconnectConversation();
      } else {
        await connectConversation();
      }
    } catch (error) {
      setConnectionError(
        error instanceof Error ? error.message : "Connection failed"
      );
      console.error("Connection error:", error);
    }
  };

  useEffect(() => {
    onConnectionChange(isConnected);
  }, [isConnected, onConnectionChange]);

  return (
    <div className="w-full max-w-md relative">
      {connectionError && (
        <span className="text-red-500 text-sm">{connectionError}</span>
      )}

      {isConnected && (
        <>
          <VoiceVisualizer wavRef={wavStreamPlayerRef} />

          <RealtimeEventsDisplay
            events={realtimeEvents}
            startTime={startTimeRef.current}
          />
        </>
      )}

      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-[calc(env(safe-area-inset-bottom)+1rem)] px-4">
        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                size="lg"
                onClick={handleConnectionToggle}
                className="w-full max-w-[200px] mx-auto py-6 rounded-full bg-[#012854] text-white hover:bg-[#023a7a] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-between px-4 shadow-lg shimmer"
              >
                <span className="flex-grow text-center">
                  {isConnecting
                    ? "Connecting..."
                    : `Speak with ${AGENT_INFO.SHORT_NAME}`}
                </span>
                {isConnecting ? (
                  <Loader2 className="h-6 w-6 ml-2 flex-shrink-0 animate-spin" />
                ) : (
                  <AudioLines className="h-6 w-6 ml-2 flex-shrink-0" />
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-2"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-4 rounded-full ${
                    isMuted
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-[#012854] hover:bg-[#023a7a]"
                  } text-white transition-colors duration-200`}
                >
                  {!isMuted ? (
                    <Mic className="h-6 w-6" />
                  ) : (
                    <MicOff className="h-6 w-6" />
                  )}
                </button>
              </motion.div>
              <div className="w-24 h-12">
                <VoiceVisualizer wavRef={wavRecorderRef} />
              </div>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                onClick={handleConnectionToggle}
              >
                <X className="h-6 w-6" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
