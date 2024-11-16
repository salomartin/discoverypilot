import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  RealtimeClient,
} from '@openai/realtime-api-beta';
import { WavRecorder } from 'wavtools';
import { ItemType } from '@openai/realtime-api-beta/dist/lib/client';

/**
 * Type for all event logs
 */
export interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: {
    event_id?: string;
    type?: string;
    [key: string]: any;
  };
}

// First, let's define some types for our conversation items
interface ConversationItem {
  id: string;
  status: string;
  formatted: {
    audio?: ArrayBuffer;
    file?: any;
  };
}

export function useRealtimeClient(
  startTimeRef: React.RefObject<string>,
  setRealtimeEvents: React.Dispatch<React.SetStateAction<RealtimeEvent[]>>,
  wavStreamPlayerRef: React.RefObject<any>,
  wavRecorderRef: React.RefObject<any>,
  tools?: [{ schema: any; fn: any }]
) {
  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient({
      url: 'http://localhost:5173/relay',
    })
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [items, setItems] = useState<ItemType[]>([]);

  const disconnect = useCallback(async () => {
    const client = clientRef.current;
    if (client?.isConnected?.()) {
      await client.disconnect();
    }
    setIsConnected(false);
    setItems([]);
  }, []);

  const connect = useCallback(async () => {
    const client = clientRef.current;
    try {
      if (!client?.isConnected?.()) {
        console.log('Attempting to connect...');
        await client.connect();
        console.log('Connected successfully');

        // Listen for session updates
        client.on('session.updated', (session) => {
          console.log('Session updated:', session);
          // Handle session updates if necessary
        });
      }
      setIsConnected(true);
      setItems(client.conversation.getItems());
    } catch (error) {
      console.error('Connection failed:', error);
      setIsConnected(false);
      throw error;
    }
  }, []);

  const disconnectConversation = useCallback(async () => {
    try {
      await wavRecorderRef.current?.end();
      await wavStreamPlayerRef.current?.interrupt();
      await disconnect();
      setIsConnected(false);
    } catch (error) {
      console.error('Disconnection error:', error);
      setIsConnected(false);
    }
  }, [disconnect]);

  const connectConversation = useCallback(async () => {
    try {
      startTimeRef.current = new Date().toISOString();
      await connect();

      if (clientRef.current?.isConnected?.()) {
        setRealtimeEvents([]);
        setItems(clientRef.current.conversation.getItems());

        await wavStreamPlayerRef.current?.connect();
        await wavRecorderRef.current?.begin();

        await wavRecorderRef.current?.record((data: { mono: ArrayBuffer }) => {
          if (clientRef.current?.isConnected?.() && !isMuted) {
            clientRef.current.appendInputAudio(data.mono);
          }
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      await disconnectConversation();
      throw error;
    }
  }, [connect, disconnectConversation, isMuted, setRealtimeEvents, startTimeRef]);

  useEffect(() => {
    const client = clientRef.current;

    // Add client-side tools only
    tools?.forEach((obj) => client.addTool(obj.schema, obj.fn));

    client.on('error', (error: Error) => {
      console.error('Client Error:', error);
      setRealtimeEvents((prev) => [
        ...prev,
        {
          time: new Date().toISOString(),
          source: 'client',
          event: { type: 'error', error: error.message },
        },
      ]);
    });

    client.on('realtime.event', (event: RealtimeEvent) => {
      console.log('Realtime Event Received:', event);

      // Skip input_audio_buffer.append events
      if (event.event.type === 'input_audio_buffer.append') {
        return;
      }

      if (event.source === 'server') {
        if (
          event.event.type &&
          [
            'conversation.item.input_audio_transcription.completed',
            'response.audio_transcript.done',
            'response.cancel',
            'response.function_call_arguments.done',
          ].includes(event.event.type)
        ) {
          // no op - we want to show these server events
        } else {
          return;
        }
      }

      if (
        event.event.type ===
        'conversation.item.input_audio_transcription.completed'
      ) {
        event.source = 'client';
      }
      setRealtimeEvents((prev) => [...prev, event]);
    });

    client.on('conversation.updated', async ({ 
      item,
      delta
    }: {
      item: ConversationItem;
      delta: { audio?: ArrayBuffer };
    }) => {
      console.log('Conversation Updated:', { item, delta });
      const items = client.conversation.getItems();
      if (delta?.audio) {
        wavStreamPlayerRef.current?.add16BitPCM(delta.audio, item.id);
      }
      if (item.status === 'completed' && item.formatted.audio?.byteLength) {
        try {
          const wavFile = await WavRecorder.decode(
            item.formatted.audio,
            24000,
            24000
          );
          item.formatted.file = wavFile;
        } catch (decodeError) {
          console.error('Error decoding audio:', decodeError);
        }
      }
      setItems(items);
    });

    client.on('conversation.interrupted', async () => {
      console.log('Conversation Interrupted');
      const trackSampleOffset = await wavStreamPlayerRef.current?.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });

    return () => {
      tools?.forEach((obj) => client.removeTool(obj.schema.name));
      client.off('error');
      client.off('realtime.event');
      client.off('conversation.updated');
      client.off('conversation.interrupted');
    };
  }, [tools, setRealtimeEvents, wavStreamPlayerRef, wavRecorderRef]);

  const setMuted = useCallback(async (muted: boolean) => {
    setIsMuted(muted);
    if (muted) {
      await wavRecorderRef.current?.end();
    } else {
      await wavRecorderRef.current?.begin();
      await wavRecorderRef.current?.record((data: { mono: ArrayBuffer }) => {
        if (clientRef.current?.isConnected?.() && !muted) {
          clientRef.current.appendInputAudio(data.mono);
        }
      });
    }
  }, []);

  return {
    client: clientRef.current,
    isConnected,
    isMuted,
    setIsMuted: setMuted,
    items,
    connectConversation,
    disconnectConversation,
  };
}
