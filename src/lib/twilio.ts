// src/lib/twilio.ts

export const twilio = {
    messages: {
      create: async (opts: any) => {
        console.log("Mock SMS:", opts);
        return { sid: 'MOCK_SID' };
      },
    },
  };
  