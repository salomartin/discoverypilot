import { useCallback, useEffect, useRef, useState } from 'react';
import type { RealtimeEvent } from '../utils/useRealtimeClient.client';
import { useRealtimeClient } from '../utils/useRealtimeClient.client';
import { WavRecorder, WavStreamPlayer } from 'wavtools';
import { VoiceVisualizer } from './VoiceVisualizer';

const STORAGE_KEY = 'voice_client_memory';

export default function VoiceClient() {
  const startTimeRef = useRef<string>(new Date().toISOString());
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [memoryKv, setMemoryKv] = useState<{ [key: string]: any }>(() => {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      todaysDate: new Date().toISOString().split('T')[0],
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryKv));
    }
  }, [memoryKv]);

  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000 })
  );
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000 })
  );

  const { client, isConnected, isMuted, setIsMuted, connectConversation, disconnectConversation } =
    useRealtimeClient(
      startTimeRef,
      setRealtimeEvents,
      wavStreamPlayerRef,
      wavRecorderRef,
      [
        {
          schema: {
            name: 'set_memory',
            description:
              'Saves important data about the user into memory. If keys are close, prefer overwriting keys rather than creating new keys.',
            parameters: {
              type: 'object',
              properties: {
                key: {
                  type: 'string',
                  description:
                    'The key of the memory value. Always use lowercase and underscores, no other characters.',
                },
                value: {
                  type: 'string',
                  description: 'Value can be anything represented as a string',
                },
              },
              required: ['key', 'value'],
            },
          },
          async fn({ key, value }: { key: string; value: string }) {
            setMemoryKv((prev) => ({ ...prev, [key]: value }));
          },
        },
      ]
    );

  const formatTime = useCallback((timestamp: string) => {
    const startTime = startTimeRef.current;
    const t0 = new Date(startTime).valueOf();
    const t1 = new Date(timestamp).valueOf();
    const delta = t1 - t0;
    const hs = Math.floor(delta / 10) % 100;
    const s = Math.floor(delta / 1000) % 60;
    const m = Math.floor(delta / 60_000) % 60;
    const pad = (n: number) => {
      let s = n + '';
      while (s.length < 2) {
        s = '0' + s;
      }
      return s;
    };
    return `${pad(m)}:${pad(s)}.${pad(hs)}`;
  }, []);

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
      setConnectionError(error instanceof Error ? error.message : 'Connection failed');
      console.error('Connection error:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-none justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleConnectionToggle}
            className={`flex items-center gap-2 font-['Roboto_Mono'] text-xs font-normal border-none rounded-[1000px] min-h-[42px] transition-all duration-100 outline-none disabled:text-[#999] enabled:cursor-pointer px-4 ${
              isConnected
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
          {connectionError && (
            <span className="text-red-500 text-sm">{connectionError}</span>
          )}
          {isConnected && (
            <span className="flex space-x-2">
              <button
                className="flex items-center gap-2 font-['Roboto_Mono'] text-xs font-normal border-none rounded-[1000px] min-h-[42px] transition-all duration-100 outline-none disabled:text-[#999] enabled:cursor-pointer bg-[#101010] text-[#ececf1] hover:enabled:bg-[#404040]"
                onClick={() => client.createResponse()}
              >
                Force Reply
              </button>
              <button
                className={`flex items-center gap-2 font-['Roboto_Mono'] text-xs font-normal border-none rounded-[1000px] px-6 min-h-[42px] transition-all duration-100 outline-none disabled:text-[#999] enabled:cursor-pointer ${
                  isMuted
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-[#101010] text-[#ececf1] hover:enabled:bg-[#404040]'
                }`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? '🔇 Unmute' : '🔊 Mute'}
              </button>
            </span>
          )}
        </div>
      </div>

      <div className="overflow-auto flex-1">
        <div className="flex flex-col h-full md:flex-row">
          <div className="overflow-auto flex-1 border-r border-gray-200">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 max-w-[100%]">
                <div className="flex-1">
                  <VoiceVisualizer wavRef={wavRecorderRef} />
                </div>
                <div className="flex-1">
                  <VoiceVisualizer wavRef={wavStreamPlayerRef} />
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-auto w-full md:w-96">
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700">Memory</h3>
                <pre className="mt-2 text-xs text-wrap">
                  {JSON.stringify(memoryKv, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Filtered Events ({realtimeEvents.length})
                </h3>
                <div className="overflow-auto mt-2 space-y-2 h-full">
                  {realtimeEvents.map((event, i) => (
                    <div
                      key={i}
                      className={`text-xs p-2 rounded ${
                        event.source === 'server' ? 'bg-green-50' : 'bg-blue-50'
                      }`}
                    >
                      <details className="flex justify-between items-center">
                        <summary className="font-mono">
                          {formatTime(event.time) + ' '}
                          <span className="text-xs text-gray-600">
                            {event.event?.transcript ? (
                              <p>{`"${event.event.transcript}"`}</p>
                            ) : event.event?.type === 'response.function_call_arguments.done' && event.event?.name ? (
                              `${event.event.name}(${event.event.arguments || ''})`
                            ) : (
                              <span className="font-mono">
                                {event.event?.type || 'unknown event'}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 