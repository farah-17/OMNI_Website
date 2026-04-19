const SYSTEM_PROMPT = `You are the OMNI Product Expert, a helpful and sophisticated AI assistant for the OMNI device.
Your goal is to answer questions ONLY about the OMNI product. If a user asks about anything else, politely redirect them to OMNI.

OMNI Product Details:
- Name: OMNI
- Description: A high-end, customizable macro pad and AI interface.
- Core Features:
  - 3x3 Mechanical Key Grid: Hot-swappable Cherry MX-style switches.
  - OLED Display: 0.96" high-contrast monochrome (128x64) for real-time feedback and system stats.
  - Dual Rotary Encoders: CNC-machined 6061 aluminum with diamond knurling for precision control (volume, zoom, etc.).
  - Built-in MEMS Microphone: Integrated with noise-canceling mesh for voice commands and dictation.
  - OMNI OS v1.0: Custom operating system for seamless hardware-software integration.
- Pricing:
  - Base Price: 189 TN.
- Optional Add-Ons:
  - Pro-AI Package (+149 TN): Advanced natural language processing for smarter voice commands and custom macros.
  - OMNI Care+ (+79 TN): 2-year accidental damage protection.
- Customization:
  - Chassis Finishes: Silver Aluminum, Stealth Matte, Midnight Blue, Dark Purple.
  - Keycap Colors: Arctic White, Obsidian Black, Electric Blue, Dark Purple.

Tone: Professional, tech-forward, and helpful. Keep responses concise.`;

const API_URL =
  "https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:generateContent";

export async function getChatResponse(
  message: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return "API key not configured. Please add VITE_GEMINI_API_KEY to your .env.local file.";
  }

  try {
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          ...history,
          { role: "user", parts: [{ text: message }] },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("Gemini API error:", err);
      return "I'm having trouble connecting right now. Please try again later.";
    }

    const data = await response.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't process that request."
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
}
