import { GoogleGenAI, Type, Modality } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const getSystemInstruction = (nativeLang: string, targetLang: string) => 
  `You are an expert language tutor. The user speaks ${nativeLang} and wants to learn ${targetLang}.
  Always provide translations, pronunciations (transliteration), and the native script of ${targetLang} if applicable.
  Be encouraging, clear, and culturally accurate.`;

export async function generateVocabulary(topic: string, nativeLang: string, targetLang: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Generate 5 essential words or short phrases related to: ${topic}. The user speaks ${nativeLang} and is learning ${targetLang}.`,
    config: {
      systemInstruction: getSystemInstruction(nativeLang, targetLang),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            native_word: { type: Type.STRING, description: `The word/phrase in ${nativeLang}` },
            target_word: { type: Type.STRING, description: `The translation in ${targetLang} (native script)` },
            target_pronunciation: { type: Type.STRING, description: `The pronunciation/transliteration of the ${targetLang} word` },
            explanation: { type: Type.STRING, description: "Brief explanation of usage or literal meaning" }
          },
          required: ["native_word", "target_word", "target_pronunciation", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}

export async function generateQuiz(nativeLang: string, targetLang: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Generate a 5-question multiple choice quiz for a beginner learning ${targetLang}. The user speaks ${nativeLang}. Test basic vocabulary and simple grammar.`,
    config: {
      systemInstruction: getSystemInstruction(nativeLang, targetLang),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: `The quiz question in ${nativeLang}` },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: `4 possible answers (can be in ${nativeLang} or ${targetLang})`
            },
            correctAnswer: { type: Type.STRING, description: "The exact string of the correct option" },
            explanation: { type: Type.STRING, description: `Why this answer is correct, explained in ${nativeLang}` }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}

export function createChatSession(nativeLang: string, targetLang: string) {
  const ai = getAI();
  return ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: getSystemInstruction(nativeLang, targetLang),
    }
  });
}

export async function generateAudio(text: string) {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Please read the following text aloud clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error: any) {
    console.error("TTS Error:", error);
    throw new Error(error?.message || "Failed to generate audio. The language or script might not be supported by the voice model.");
  }
}
