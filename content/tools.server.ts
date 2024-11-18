// Server-side tools definition
export const SERVER_TOOLS = [
    {
      schema: {
        name: 'end_session',
        description: 'Ends the interview session when all necessary information has been gathered',
        parameters: {
          type: 'object',
          properties: {
            reason: {
              type: 'string',
              description: 'The reason for ending the session',
            },
            summary: {
              type: 'string',
              description: 'Brief summary of the completed interview',
            },
          },
          required: ['reason', 'summary'],
        },
      },
      fn: async ({ reason, summary }: { reason: string; summary: string }) => {
        return { 
          success: true,
          shouldDisconnect: true,
          reason,
          summary 
        };
      },
    },
];