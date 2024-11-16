## RealtimeBeta

Communicate with a GPT-4o class model live, in real time, over WebSocket. Produces both audio and text transcriptions. [Learn more about the Realtime API](https://platform.openai.com/docs/guides/realtime).

## Client events

These are events that the OpenAI Realtime WebSocket server will accept from the client.

##

## session.update

Send this event to update the session’s default configuration. The client may send this event at any time to update the session configuration, and any field may be updated at any time, except for "voice". The server will respond with a `session.updated` event that shows the full effective configuration. Only fields that are present are updated, thus the correct way to clear a field like "instructions" is to pass an empty string.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/session/update-event_id)

event\_id

string

Optional client-generated ID used to identify this event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/session/update-type)

type

string

The event type, must be "session.update".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/session/update-session)

session

object

Realtime session object configuration.

Show properties

session.update

```JSON
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
{
    "event_id": "event_123",
    "type": "session.update",
    "session": {
        "modalities": ["text", "audio"],
        "instructions": "Your knowledge cutoff is 2023-10. You are a helpful assistant.",
        "voice": "alloy",
        "input_audio_format": "pcm16",
        "output_audio_format": "pcm16",
        "input_audio_transcription": {
            "model": "whisper-1"
        },
        "turn_detection": {
            "type": "server_vad",
            "threshold": 0.5,
            "prefix_padding_ms": 300,
            "silence_duration_ms": 500
        },
        "tools": [
            {
                "type": "function",
                "name": "get_weather",
                "description": "Get the current weather for a location, tell the user you are fetching the weather.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": { "type": "string" }
                    },
                    "required": ["location"]
                }
            }
        ],
        "tool_choice": "auto",
        "temperature": 0.8,
        "max_response_output_tokens": "inf"
    }
}
```

##

## input\_audio\_buffer.append

Send this event to append audio bytes to the input audio buffer. The audio buffer is temporary storage you can write to and later commit. In Server VAD mode, the audio buffer is used to detect speech and the server will decide when to commit. When Server VAD is disabled, you must commit the audio buffer manually. The client may choose how much audio to place in each event up to a maximum of 15 MiB, for example streaming smaller chunks from the client may allow the VAD to be more responsive. Unlike other client events, the server will not send a confirmation response to this event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/input_audio_buffer/append-event_id)

event\_id

string

Optional client-generated ID used to identify this event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/input_audio_buffer/append-type)

type

string

The event type, must be "input\_audio\_buffer.append".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/input_audio_buffer/append-audio)

audio

string

Base64-encoded audio bytes. This must be in the format specified by the `input_audio_format` field in the session configuration.

input\_audio\_buffer.append

```JSON
1
2
3
4
5
{
    "event_id": "event_456",
    "type": "input_audio_buffer.append",
    "audio": "Base64EncodedAudioData"
}
```

## input\_audio\_buffer.commit

Send this event to commit the user input audio buffer, which will create a new user message item in the conversation. This event will produce an error if the input audio buffer is empty. When in Server VAD mode, the client does not need to send this event, the server will commit the audio buffer automatically. Committing the input audio buffer will trigger input audio transcription (if enabled in session configuration), but it will not create a response from the model. The server will respond with an `input_audio_buffer.committed` event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/input_audio_buffer/commit-event_id)

event\_id

string

Optional client-generated ID used to identify this event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/input_audio_buffer/commit-type)

type

string

The event type, must be "input\_audio\_buffer.commit".

input\_audio\_buffer.commit

```JSON
1
2
3
4
{
    "event_id": "event_789",
    "type": "input_audio_buffer.commit"
}
```

## input\_audio\_buffer.clear

Send this event to clear the audio bytes in the buffer. The server will respond with an `input_audio_buffer.cleared` event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/input_audio_buffer/clear-event_id)

event\_id

string

Optional client-generated ID used to identify this event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/input_audio_buffer/clear-type)

type

string

The event type, must be "input\_audio\_buffer.clear".

input\_audio\_buffer.clear

```JSON
1
2
3
4
{
    "event_id": "event_012",
    "type": "input_audio_buffer.clear"
}
```

##

##

## conversation.item.create

Add a new Item to the Conversation's context, including messages, function calls, and function call responses. This event can be used both to populate a "history" of the conversation and to add new items mid-stream, but has the current limitation that it cannot populate assistant audio messages. If successful, the server will respond with a `conversation.item.created` event, otherwise an `error` event will be sent.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/conversation/item/create-event_id)

event\_id

string

Optional client-generated ID used to identify this event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/conversation/item/create-type)

type

string

The event type, must be `conversation.item.create`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/conversation/item/create-previous_item_id)

previous\_item\_id

string

The ID of the preceding item after which the new item will be inserted. If not set, the new item will be appended to the end of the conversation. If set, it allows an item to be inserted mid-conversation. If the ID cannot be found, an error will be returned and the item will not be added.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/conversation/item/create-item)

item

object

The item to add to the conversation.

Show properties

conversation.item.create

```JSON
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
{
    "event_id": "event_345",
    "type": "conversation.item.create",
    "previous_item_id": null,
    "item": {
        "id": "msg_001",
        "type": "message",
        "role": "user",
        "content": [
            {
                "type": "input_text",
                "text": "Hello, how are you?"
            }
        ]
    }
}
```

## conversation.item.truncate

Send this event to truncate a previous assistant message’s audio. The server will produce audio faster than realtime, so this event is useful when the user interrupts to truncate audio that has already been sent to the client but not yet played. This will synchronize the server's understanding of the audio with the client's playback. Truncating audio will delete the server-side text transcript to ensure there is not text in the context that hasn't been heard by the user. If successful, the server will respond with a `conversation.item.truncated` event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/conversation/item/truncate-event_id)

event\_id

string

Optional client-generated ID used to identify this event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/conversation/item/truncate-type)

type

string

The event type, must be "conversation.item.truncate".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/conversation/item/truncate-item_id)

item\_id

string

The ID of the assistant message item to truncate. Only assistant message items can be truncated.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/conversation/item/truncate-content_index)

content\_index

integer

The index of the content part to truncate. Set this to 0.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/conversation/item/truncate-audio_end_ms)

audio\_end\_ms

integer

Inclusive duration up to which audio is truncated, in milliseconds. If the audio\_end\_ms is greater than the actual audio duration, the server will respond with an error.

conversation.item.truncate

```JSON
1
2
3
4
5
6
7
{
    "event_id": "event_678",
    "type": "conversation.item.truncate",
    "item_id": "msg_002",
    "content_index": 0,
    "audio_end_ms": 1500
}
```

## conversation.item.delete

Send this event when you want to remove any item from the conversation history. The server will respond with a `conversation.item.deleted` event, unless the item does not exist in the conversation history, in which case the server will respond with an error.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/conversation/item/delete-event_id)

event\_id

string

Optional client-generated ID used to identify this event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/conversation/item/delete-type)

type

string

The event type, must be "conversation.item.delete".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/conversation/item/delete-item_id)

item\_id

string

The ID of the item to delete.

conversation.item.delete

```JSON
1
2
3
4
5
{
    "event_id": "event_901",
    "type": "conversation.item.delete",
    "item_id": "msg_003"
}
```

##

## response.create

This event instructs the server to create a Response, which means triggering model inference. When in Server VAD mode, the server will create Responses automatically. A Response will include at least one Item, and may have two, in which case the second will be a function call. These Items will be appended to the conversation history. The server will respond with a `response.created` event, events for Items and content created, and finally a `response.done` event to indicate the Response is complete. The `response.create` event includes inference configuration like `instructions`, and `temperature`. These fields will override the Session's configuration for this Response only.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/response/create-event_id)

event\_id

string

Optional client-generated ID used to identify this event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/response/create-type)

type

string

The event type, must be `response.create`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/response/create-response)

response

object

The response resource.

Show properties

response.create

```JSON
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
{
    "event_id": "event_234",
    "type": "response.create",
    "response": {
        "modalities": ["text", "audio"],
        "instructions": "Please assist the user.",
        "voice": "alloy",
        "output_audio_format": "pcm16",
        "tools": [
            {
                "type": "function",
                "name": "calculate_sum",
                "description": "Calculates the sum of two numbers.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "a": { "type": "number" },
                        "b": { "type": "number" }
                    },
                    "required": ["a", "b"]
                }
            }
        ],
        "tool_choice": "auto",
        "temperature": 0.7,
        "max_output_tokens": 150
    }
}
```

## response.cancel

Send this event to cancel an in-progress response. The server will respond with a `response.cancelled` event or an error if there is no response to cancel.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/response/cancel-event_id)

event\_id

string

Optional client-generated ID used to identify this event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-client-events/response/cancel-type)

type

string

The event type, must be `response.cancel`.

response.cancel

```JSON
1
2
3
4
{
    "event_id": "event_567",
    "type": "response.cancel"
}
```

## Server events

These are events emitted from the OpenAI Realtime WebSocket server to the client.

## error

Returned when an error occurs, which could be a client problem or a server problem. Most errors are recoverable and the session will stay open, we recommend to implementors to monitor and log error messages by default.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/error-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/error-type)

type

string

The event type, must be "error".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/error-error)

error

object

Details of the error.

Show properties

error

```JSON
1
2
3
4
5
6
7
8
9
10
11
{
    "event_id": "event_890",
    "type": "error",
    "error": {
        "type": "invalid_request_error",
        "code": "invalid_event",
        "message": "The 'type' field is missing.",
        "param": null,
        "event_id": "event_567"
    }
}
```

##

## session.created

Returned when a Session is created. Emitted automatically when a new connection is established as the first server event. This event will contain the default Session configuration.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/session/created-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/session/created-type)

type

string

The event type, must be `session.created`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/session/created-session)

session

object

Realtime session object configuration.

Show properties

session.created

```JSON
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
{
    "event_id": "event_1234",
    "type": "session.created",
    "session": {
        "id": "sess_001",
        "object": "realtime.session",
        "model": "gpt-4o-realtime-preview-2024-10-01",
        "modalities": ["text", "audio"],
        "instructions": "",
        "voice": "alloy",
        "input_audio_format": "pcm16",
        "output_audio_format": "pcm16",
        "input_audio_transcription": null,
        "turn_detection": {
            "type": "server_vad",
            "threshold": 0.5,
            "prefix_padding_ms": 300,
            "silence_duration_ms": 200
        },
        "tools": [],
        "tool_choice": "auto",
        "temperature": 0.8,
        "max_response_output_tokens": null
    }
}
```

## session.updated

Returned when a session is updated with a `session.update` event, unless there is an error.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/session/updated-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/session/updated-type)

type

string

The event type, must be "session.updated".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/session/updated-session)

session

object

Realtime session object configuration.

Show properties

session.updated

```JSON
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
{
    "event_id": "event_5678",
    "type": "session.updated",
    "session": {
        "id": "sess_001",
        "object": "realtime.session",
        "model": "gpt-4o-realtime-preview-2024-10-01",
        "modalities": ["text"],
        "instructions": "New instructions",
        "voice": "alloy",
        "input_audio_format": "pcm16",
        "output_audio_format": "pcm16",
        "input_audio_transcription": {
            "model": "whisper-1"
        },
        "turn_detection": null,
        "tools": [],
        "tool_choice": "none",
        "temperature": 0.7,
        "max_response_output_tokens": 200
    }
}
```

##

## conversation.created

Returned when a conversation is created. Emitted right after session creation.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/created-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/created-type)

type

string

The event type, must be "conversation.created".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/created-conversation)

conversation

object

The conversation resource.

Show properties

conversation.created

```JSON
1
2
3
4
5
6
7
8
{
    "event_id": "event_9101",
    "type": "conversation.created",
    "conversation": {
        "id": "conv_001",
        "object": "realtime.conversation"
    }
}
```

##

## conversation.item.created

Returned when a conversation item is created. There are several scenarios that produce this event:

* The server is generating a Response, which if successful will produce either one or two Items, which will be of type `message` (role `assistant`) or type `function_call`.
* The input audio buffer has been committed, either by the client or the server (in `server_vad` mode). The server will take the content of the input audio buffer and add it to a new user message Item.
* The client has sent a `conversation.item.create` event to add a new Item to the Conversation.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/created-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/created-type)

type

string

The event type, must be `conversation.item.created`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/created-previous_item_id)

previous\_item\_id

string

The ID of the preceding item in the Conversation context, allows the client to understand the order of the conversation.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/created-item)

item

object

The item to add to the conversation.

Show properties

conversation.item.created

```JSON
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
{
    "event_id": "event_1920",
    "type": "conversation.item.created",
    "previous_item_id": "msg_002",
    "item": {
        "id": "msg_003",
        "object": "realtime.item",
        "type": "message",
        "status": "completed",
        "role": "user",
        "content": [
            {
                "type": "input_audio",
                "transcript": "hello how are you",
                "audio": "base64encodedaudio=="
            }
        ]
    }
}
```

##

## conversation.item.input\_audio\_transcription.completed

This event is the output of audio transcription for user audio written to the user audio buffer. Transcription begins when the input audio buffer is committed by the client or server (in `server_vad` mode). Transcription runs asynchronously with Response creation, so this event may come before or after the Response events. Realtime API models accept audio natively, and thus input transcription is a separate process run on a separate ASR (Automatic Speech Recognition) model, currently always `whisper-1`. Thus the transcript may diverge somewhat from the model's interpretation, and should be treated as a rough guide.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/input_audio_transcription/completed-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/input_audio_transcription/completed-type)

type

string

The event type, must be `conversation.item.input_audio_transcription.completed`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/input_audio_transcription/completed-item_id)

item\_id

string

The ID of the user message item containing the audio.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/input_audio_transcription/completed-content_index)

content\_index

integer

The index of the content part containing the audio.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/input_audio_transcription/completed-transcript)

transcript

string

The transcribed text.

conversation.item.input\_audio\_transcription.completed

```JSON
1
2
3
4
5
6
7
{
    "event_id": "event_2122",
    "type": "conversation.item.input_audio_transcription.completed",
    "item_id": "msg_003",
    "content_index": 0,
    "transcript": "Hello, how are you?"
}
```

## conversation.item.input\_audio\_transcription.failed

Returned when input audio transcription is configured, and a transcription request for a user message failed. These events are separate from other `error` events so that the client can identify the related Item.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/input_audio_transcription/failed-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/input_audio_transcription/failed-type)

type

string

The event type, must be `conversation.item.input_audio_transcription.failed`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/input_audio_transcription/failed-item_id)

item\_id

string

The ID of the user message item.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/input_audio_transcription/failed-content_index)

content\_index

integer

The index of the content part containing the audio.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/input_audio_transcription/failed-error)

error

object

Details of the transcription error.

Show properties

conversation.item.input\_audio\_transcription.failed

```JSON
1
2
3
4
5
6
7
8
9
10
11
12
{
    "event_id": "event_2324",
    "type": "conversation.item.input_audio_transcription.failed",
    "item_id": "msg_003",
    "content_index": 0,
    "error": {
        "type": "transcription_error",
        "code": "audio_unintelligible",
        "message": "The audio could not be transcribed.",
        "param": null
    }
}
```

## conversation.item.truncated

Returned when an earlier assistant audio message item is truncated by the client with a `conversation.item.truncate` event. This event is used to synchronize the server's understanding of the audio with the client's playback. This action will truncate the audio and remove the server-side text transcript to ensure there is no text in the context that hasn't been heard by the user.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/truncated-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/truncated-type)

type

string

The event type, must be `conversation.item.truncated`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/truncated-item_id)

item\_id

string

The ID of the assistant message item that was truncated.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/truncated-content_index)

content\_index

integer

The index of the content part that was truncated.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/truncated-audio_end_ms)

audio\_end\_ms

integer

The duration up to which the audio was truncated, in milliseconds.

conversation.item.truncated

```JSON
1
2
3
4
5
6
7
{
    "event_id": "event_2526",
    "type": "conversation.item.truncated",
    "item_id": "msg_004",
    "content_index": 0,
    "audio_end_ms": 1500
}
```

## conversation.item.deleted

Returned when an item in the conversation is deleted by the client with a `conversation.item.delete` event. This event is used to synchronize the server's understanding of the conversation history with the client's view.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/deleted-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/deleted-type)

type

string

The event type, must be `conversation.item.deleted`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/conversation/item/deleted-item_id)

item\_id

string

The ID of the item that was deleted.

conversation.item.deleted

```JSON
1
2
3
4
5
{
    "event_id": "event_2728",
    "type": "conversation.item.deleted",
    "item_id": "msg_005"
}
```

##

## input\_audio\_buffer.committed

Returned when an input audio buffer is committed, either by the client or automatically in server VAD mode. The `item_id` property is the ID of the user message item that will be created, thus a `conversation.item.created` event will also be sent to the client.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/input_audio_buffer/committed-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/input_audio_buffer/committed-type)

type

string

The event type, must be `input_audio_buffer.committed`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/input_audio_buffer/committed-previous_item_id)

previous\_item\_id

string

The ID of the preceding item after which the new item will be inserted.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/input_audio_buffer/committed-item_id)

item\_id

string

The ID of the user message item that will be created.

input\_audio\_buffer.committed

```JSON
1
2
3
4
5
6
{
    "event_id": "event_1121",
    "type": "input_audio_buffer.committed",
    "previous_item_id": "msg_001",
    "item_id": "msg_002"
}
```

## input\_audio\_buffer.cleared

Returned when the input audio buffer is cleared by the client with a `input_audio_buffer.clear` event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/input_audio_buffer/cleared-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/input_audio_buffer/cleared-type)

type

string

The event type, must be `input_audio_buffer.cleared`.

input\_audio\_buffer.cleared

```JSON
1
2
3
4
{
    "event_id": "event_1314",
    "type": "input_audio_buffer.cleared"
}
```

## input\_audio\_buffer.speech\_started

Sent by the server when in `server_vad` mode to indicate that speech has been detected in the audio buffer. This can happen any time audio is added to the buffer (unless speech is already detected). The client may want to use this event to interrupt audio playback or provide visual feedback to the user. The client should expect to receive a `input_audio_buffer.speech_stopped` event when speech stops. The `item_id` property is the ID of the user message item that will be created when speech stops and will also be included in the `input_audio_buffer.speech_stopped` event (unless the client manually commits the audio buffer during VAD activation).

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/input_audio_buffer/speech_started-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/input_audio_buffer/speech_started-type)

type

string

The event type, must be `input_audio_buffer.speech_started`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/input_audio_buffer/speech_started-audio_start_ms)

audio\_start\_ms

integer

Milliseconds from the start of all audio written to the buffer during the session when speech was first detected. This will correspond to the beginning of audio sent to the model, and thus includes the `prefix_padding_ms` configured in the Session.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/input_audio_buffer/speech_started-item_id)

item\_id

string

The ID of the user message item that will be created when speech stops.

input\_audio\_buffer.speech\_started

```JSON
1
2
3
4
5
6
{
    "event_id": "event_1516",
    "type": "input_audio_buffer.speech_started",
    "audio_start_ms": 1000,
    "item_id": "msg_003"
}
```

## input\_audio\_buffer.speech\_stopped

Returned in `server_vad` mode when the server detects the end of speech in the audio buffer. The server will also send an `conversation.item.created` event with the user message item that is created from the audio buffer.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/input_audio_buffer/speech_stopped-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/input_audio_buffer/speech_stopped-type)

type

string

The event type, must be `input_audio_buffer.speech_stopped`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/input_audio_buffer/speech_stopped-audio_end_ms)

audio\_end\_ms

integer

Milliseconds since the session started when speech stopped. This will correspond to the end of audio sent to the model, and thus includes the `min_silence_duration_ms` configured in the Session.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/input_audio_buffer/speech_stopped-item_id)

item\_id

string

The ID of the user message item that will be created.

input\_audio\_buffer.speech\_stopped

```JSON
1
2
3
4
5
6
{
    "event_id": "event_1718",
    "type": "input_audio_buffer.speech_stopped",
    "audio_end_ms": 2000,
    "item_id": "msg_003"
}
```

##

## response.created

Returned when a new Response is created. The first event of response creation, where the response is in an initial state of `in_progress`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/created-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/created-type)

type

string

The event type, must be `response.created`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/created-response)

response

object

The response resource.

Show properties

response.created

```JSON
1
2
3
4
5
6
7
8
9
10
11
12
{
    "event_id": "event_2930",
    "type": "response.created",
    "response": {
        "id": "resp_001",
        "object": "realtime.response",
        "status": "in_progress",
        "status_details": null,
        "output": [],
        "usage": null
    }
}
```

## response.done

Returned when a Response is done streaming. Always emitted, no matter the final state. The Response object included in the `response.done` event will include all output Items in the Response but will omit the raw audio data.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/done-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/done-type)

type

string

The event type, must be "response.done".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/done-response)

response

object

The response resource.

Show properties

response.done

```JSON
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
{
    "event_id": "event_3132",
    "type": "response.done",
    "response": {
        "id": "resp_001",
        "object": "realtime.response",
        "status": "completed",
        "status_details": null,
        "output": [
            {
                "id": "msg_006",
                "object": "realtime.item",
                "type": "message",
                "status": "completed",
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": "Sure, how can I assist you today?"
                    }
                ]
            }
        ],
        "usage": {
            "total_tokens":275,
            "input_tokens":127,
            "output_tokens":148,
            "input_token_details": {
                "cached_tokens":384,
                "text_tokens":119,
                "audio_tokens":8,
                "cached_tokens_details": {
                    "text_tokens": 128,
                    "audio_tokens": 256
                }
            },
            "output_token_details": {
              "text_tokens":36,
              "audio_tokens":112
            }
        }
    }
}
```

##

## response.output\_item.added

Returned when a new Item is created during Response generation.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/output_item/added-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/output_item/added-type)

type

string

The event type, must be `response.output_item.added`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/output_item/added-response_id)

response\_id

string

The ID of the Response to which the item belongs.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/output_item/added-output_index)

output\_index

integer

The index of the output item in the Response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/output_item/added-item)

item

object

The item to add to the conversation.

Show properties

response.output\_item.added

```JSON
1
2
3
4
5
6
7
8
9
10
11
12
13
14
{
    "event_id": "event_3334",
    "type": "response.output_item.added",
    "response_id": "resp_001",
    "output_index": 0,
    "item": {
        "id": "msg_007",
        "object": "realtime.item",
        "type": "message",
        "status": "in_progress",
        "role": "assistant",
        "content": []
    }
}
```

## response.output\_item.done

Returned when an Item is done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/output_item/done-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/output_item/done-type)

type

string

The event type, must be `response.output_item.done`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/output_item/done-response_id)

response\_id

string

The ID of the Response to which the item belongs.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/output_item/done-output_index)

output\_index

integer

The index of the output item in the Response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/output_item/done-item)

item

object

The item to add to the conversation.

Show properties

response.output\_item.done

```JSON
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
{
    "event_id": "event_3536",
    "type": "response.output_item.done",
    "response_id": "resp_001",
    "output_index": 0,
    "item": {
        "id": "msg_007",
        "object": "realtime.item",
        "type": "message",
        "status": "completed",
        "role": "assistant",
        "content": [
            {
                "type": "text",
                "text": "Sure, I can help with that."
            }
        ]
    }
}
```

##

## response.content\_part.added

Returned when a new content part is added to an assistant message item during response generation.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/content_part/added-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/content_part/added-type)

type

string

The event type, must be "response.content\_part.added".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/content_part/added-response_id)

response\_id

string

The ID of the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/content_part/added-item_id)

item\_id

string

The ID of the item to which the content part was added.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/content_part/added-output_index)

output\_index

integer

The index of the output item in the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/content_part/added-content_index)

content\_index

integer

The index of the content part in the item's content array.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/content_part/added-part)

part

object

The content part that was added.

Show properties

response.content\_part.added

```JSON
1
2
3
4
5
6
7
8
9
10
11
12
{
    "event_id": "event_3738",
    "type": "response.content_part.added",
    "response_id": "resp_001",
    "item_id": "msg_007",
    "output_index": 0,
    "content_index": 0,
    "part": {
        "type": "text",
        "text": ""
    }
}
```

## response.content\_part.done

Returned when a content part is done streaming in an assistant message item. Also emitted when a Response is interrupted, incomplete, or cancelled.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/content_part/done-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/content_part/done-type)

type

string

The event type, must be "response.content\_part.done".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/content_part/done-response_id)

response\_id

string

The ID of the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/content_part/done-item_id)

item\_id

string

The ID of the item.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/content_part/done-output_index)

output\_index

integer

The index of the output item in the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/content_part/done-content_index)

content\_index

integer

The index of the content part in the item's content array.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/content_part/done-part)

part

object

The content part that is done.

Show properties

response.content\_part.done

```JSON
1
2
3
4
5
6
7
8
9
10
11
12
{
    "event_id": "event_3940",
    "type": "response.content_part.done",
    "response_id": "resp_001",
    "item_id": "msg_007",
    "output_index": 0,
    "content_index": 0,
    "part": {
        "type": "text",
        "text": "Sure, I can help with that."
    }
}
```

##

## response.text.delta

Returned when the text value of a "text" content part is updated.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/text/delta-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/text/delta-type)

type

string

The event type, must be "response.text.delta".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/text/delta-response_id)

response\_id

string

The ID of the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/text/delta-item_id)

item\_id

string

The ID of the item.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/text/delta-output_index)

output\_index

integer

The index of the output item in the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/text/delta-content_index)

content\_index

integer

The index of the content part in the item's content array.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/text/delta-delta)

delta

string

The text delta.

response.text.delta

```JSON
1
2
3
4
5
6
7
8
9
{
    "event_id": "event_4142",
    "type": "response.text.delta",
    "response_id": "resp_001",
    "item_id": "msg_007",
    "output_index": 0,
    "content_index": 0,
    "delta": "Sure, I can h"
}
```

## response.text.done

Returned when the text value of a "text" content part is done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/text/done-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/text/done-type)

type

string

The event type, must be "response.text.done".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/text/done-response_id)

response\_id

string

The ID of the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/text/done-item_id)

item\_id

string

The ID of the item.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/text/done-output_index)

output\_index

integer

The index of the output item in the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/text/done-content_index)

content\_index

integer

The index of the content part in the item's content array.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/text/done-text)

text

string

The final text content.

response.text.done

```JSON
1
2
3
4
5
6
7
8
9
{
    "event_id": "event_4344",
    "type": "response.text.done",
    "response_id": "resp_001",
    "item_id": "msg_007",
    "output_index": 0,
    "content_index": 0,
    "text": "Sure, I can help with that."
}
```

##

## response.audio\_transcript.delta

Returned when the model-generated transcription of audio output is updated.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio_transcript/delta-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio_transcript/delta-type)

type

string

The event type, must be "response.audio\_transcript.delta".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio_transcript/delta-response_id)

response\_id

string

The ID of the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio_transcript/delta-item_id)

item\_id

string

The ID of the item.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio_transcript/delta-output_index)

output\_index

integer

The index of the output item in the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio_transcript/delta-content_index)

content\_index

integer

The index of the content part in the item's content array.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio_transcript/delta-delta)

delta

string

The transcript delta.

response.audio\_transcript.delta

```JSON
1
2
3
4
5
6
7
8
9
{
    "event_id": "event_4546",
    "type": "response.audio_transcript.delta",
    "response_id": "resp_001",
    "item_id": "msg_008",
    "output_index": 0,
    "content_index": 0,
    "delta": "Hello, how can I a"
}
```

## response.audio\_transcript.done

Returned when the model-generated transcription of audio output is done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio_transcript/done-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio_transcript/done-type)

type

string

The event type, must be "response.audio\_transcript.done".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio_transcript/done-response_id)

response\_id

string

The ID of the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio_transcript/done-item_id)

item\_id

string

The ID of the item.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio_transcript/done-output_index)

output\_index

integer

The index of the output item in the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio_transcript/done-content_index)

content\_index

integer

The index of the content part in the item's content array.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio_transcript/done-transcript)

transcript

string

The final transcript of the audio.

response.audio\_transcript.done

```JSON
1
2
3
4
5
6
7
8
9
{
    "event_id": "event_4748",
    "type": "response.audio_transcript.done",
    "response_id": "resp_001",
    "item_id": "msg_008",
    "output_index": 0,
    "content_index": 0,
    "transcript": "Hello, how can I assist you today?"
}
```

##

## response.audio.delta

Returned when the model-generated audio is updated.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio/delta-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio/delta-type)

type

string

The event type, must be "response.audio.delta".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio/delta-response_id)

response\_id

string

The ID of the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio/delta-item_id)

item\_id

string

The ID of the item.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio/delta-output_index)

output\_index

integer

The index of the output item in the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio/delta-content_index)

content\_index

integer

The index of the content part in the item's content array.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio/delta-delta)

delta

string

Base64-encoded audio data delta.

response.audio.delta

```JSON
1
2
3
4
5
6
7
8
9
{
    "event_id": "event_4950",
    "type": "response.audio.delta",
    "response_id": "resp_001",
    "item_id": "msg_008",
    "output_index": 0,
    "content_index": 0,
    "delta": "Base64EncodedAudioDelta"
}
```

## response.audio.done

Returned when the model-generated audio is done. Also emitted when a Response is interrupted, incomplete, or cancelled.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio/done-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio/done-type)

type

string

The event type, must be "response.audio.done".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio/done-response_id)

response\_id

string

The ID of the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio/done-item_id)

item\_id

string

The ID of the item.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio/done-output_index)

output\_index

integer

The index of the output item in the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/audio/done-content_index)

content\_index

integer

The index of the content part in the item's content array.

response.audio.done

```JSON
1
2
3
4
5
6
7
8
{
    "event_id": "event_5152",
    "type": "response.audio.done",
    "response_id": "resp_001",
    "item_id": "msg_008",
    "output_index": 0,
    "content_index": 0
}
```

##

## response.function\_call\_arguments.delta

Returned when the model-generated function call arguments are updated.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/function_call_arguments/delta-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/function_call_arguments/delta-type)

type

string

The event type, must be "response.function\_call\_arguments.delta".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/function_call_arguments/delta-response_id)

response\_id

string

The ID of the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/function_call_arguments/delta-item_id)

item\_id

string

The ID of the function call item.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/function_call_arguments/delta-output_index)

output\_index

integer

The index of the output item in the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/function_call_arguments/delta-call_id)

call\_id

string

The ID of the function call.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/function_call_arguments/delta-delta)

delta

string

The arguments delta as a JSON string.

response.function\_call\_arguments.delta

```JSON
1
2
3
4
5
6
7
8
9
{
    "event_id": "event_5354",
    "type": "response.function_call_arguments.delta",
    "response_id": "resp_002",
    "item_id": "fc_001",
    "output_index": 0,
    "call_id": "call_001",
    "delta": "{\"location\": \"San\""
}
```

## response.function\_call\_arguments.done

Returned when the model-generated function call arguments are done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/function_call_arguments/done-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/function_call_arguments/done-type)

type

string

The event type, must be "response.function\_call\_arguments.done".

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/function_call_arguments/done-response_id)

response\_id

string

The ID of the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/function_call_arguments/done-item_id)

item\_id

string

The ID of the function call item.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/function_call_arguments/done-output_index)

output\_index

integer

The index of the output item in the response.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/function_call_arguments/done-call_id)

call\_id

string

The ID of the function call.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/response/function_call_arguments/done-arguments)

arguments

string

The final arguments as a JSON string.

response.function\_call\_arguments.done

```JSON
1
2
3
4
5
6
7
8
9
{
    "event_id": "event_5556",
    "type": "response.function_call_arguments.done",
    "response_id": "resp_002",
    "item_id": "fc_001",
    "output_index": 0,
    "call_id": "call_001",
    "arguments": "{\"location\": \"San Francisco\"}"
}
```

##

## rate\_limits.updated

Emitted at the beginning of a Response to indicate the updated rate limits. When a Response is created some tokens will be "reserved" for the output tokens, the rate limits shown here reflect that reservation, which is then adjusted accordingly once the Response is completed.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/rate_limits/updated-event_id)

event\_id

string

The unique ID of the server event.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/rate_limits/updated-type)

type

string

The event type, must be `rate_limits.updated`.

[](https://platform.openai.com/docs/api-reference/realtime-server-events/response/function_call_arguments/done#realtime-server-events/rate_limits/updated-rate_limits)

rate\_limits

array

List of rate limit information.

Show properties

rate\_limits.updated

```JSON
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
{
    "event_id": "event_5758",
    "type": "rate_limits.updated",
    "rate_limits": [
        {
            "name": "requests",
            "limit": 1000,
            "remaining": 999,
            "reset_seconds": 60
        },
        {
            "name": "tokens",
            "limit": 50000,
            "remaining": 49950,
            "reset_seconds": 60
        }
    ]
}
```

##