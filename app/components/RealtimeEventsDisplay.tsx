import { useCallback } from "react";
import type { RealtimeEvent } from "../utils/useRealtimeClient.client";

interface RealtimeEventsDisplayProps {
  events: RealtimeEvent[];
  startTime: string;
}

export function RealtimeEventsDisplay({ events, startTime }: RealtimeEventsDisplayProps) {
  const formatTime = useCallback((timestamp: string) => {
    const t0 = new Date(startTime).valueOf();
    const t1 = new Date(timestamp).valueOf();
    const delta = t1 - t0;
    const hs = Math.floor(delta / 10) % 100;
    const s = Math.floor(delta / 1000) % 60;
    const m = Math.floor(delta / 60_000) % 60;
    const pad = (n: number) => {
      let s = n + "";
      while (s.length < 2) {
        s = "0" + s;
      }
      return s;
    };
    return `${pad(m)}:${pad(s)}.${pad(hs)}`;
  }, [startTime]);

  return (
    <div className="overflow-auto mt-2 space-y-2 h-full">
      {events.map((event, i) => (
        <div
          key={i}
          className={`text-xs p-2 rounded ${
            event.source === "server" ? "bg-green-50" : "bg-blue-50"
          }`}
        >
          <details className="flex justify-between items-center">
            <summary className="font-mono">
              {formatTime(event.time) + " "}
              <span className="text-xs text-gray-600">
                {event.event?.transcript ? (
                  <p>{`"${event.event.transcript}"`}</p>
                ) : event.event?.type === "response.function_call_arguments.done" &&
                  event.event?.name ? (
                  `${event.event.name}(${event.event.arguments || ""})`
                ) : (
                  <span className="font-mono">
                    {event.event?.type || "unknown event"}
                  </span>
                )}
              </span>
            </summary>
            <pre className="overflow-auto mt-2 max-h-40 whitespace-pre-wrap">
              {JSON.stringify(event.event, null, 2)}
            </pre>
          </details>
        </div>
      ))}
    </div>
  );
} 