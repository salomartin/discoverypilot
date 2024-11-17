
// Server-side tools definition
export const SERVER_TOOLS = [
    {
      schema: {
        name: 'log_interaction',
        description: 'Logs important interactions for analysis',
        parameters: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['info', 'warning', 'error'],
            },
            message: {
              type: 'string',
            },
          },
          required: ['type', 'message'],
        },
      },
      fn: async ({ type, message }: { type: string; message: string }) => {
        console.log(`[${type.toUpperCase()}] ${message}`);
        return { success: true };
      },
    },
  ];