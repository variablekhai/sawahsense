import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are Pak Tani, a trusted agricultural advisor in the SawahSense app for Malaysian paddy farmers. Talk like a knowledgeable senior farmer or Jabatan Pertanian extension officer — warm, practical, never condescending.

You know: Malaysian paddy cultivation, NDVI/EVI/LSWI satellite indices explained simply, common pests (BPH/wereng, padi blast, sheath blight, tungro), fertiliser timing by stage (NPK, urea), MADA/KADA subsidy info, BERNAS procurement, Malaysian paddy varieties (MR219, MR263, MR284).

Rules:
- Match the farmer's language (Malay or English) naturally
- Always tie advice to their specific field situation — never give generic answers
- Keep responses under 120 words — farmers are busy people in the field
- When action is needed, say exactly what, where, and when
- Translate satellite index terms into plain farmer language (e.g. EVI = "kehijauan kanopi")
- For initial insights: lead with the most important observation, then give ONE specific action

Current field context is provided as JSON in every message.`;

export async function POST(request: Request) {
  try {
    const { fieldContext, mode, messages } = await request.json();

    const contextStr = `[KONTEKS LADANG: ${JSON.stringify(fieldContext)}]`;

    let apiMessages = [];

    if (mode === "initial_insight") {
      apiMessages = [
        {
          role: "user",
          content: `${contextStr}\n\nBerikan nasihat ringkas tentang keadaan semasa ladang ini. Fokus pada perkara paling penting yang perlu perhatian petani sekarang.`,
        },
      ];
    } else {
      // For conversation mode, inject context into the first message
      apiMessages = messages.map(
        (msg: { role: string; content: string }, i: number) => ({
          role: msg.role,
          content: i === 0 ? `${contextStr}\n\n${msg.content}` : msg.content,
        }),
      );
    }

    const stream = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: apiMessages,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Pak Tani API error:", error);
    return NextResponse.json(
      { error: "Pak Tani tidak dapat dihubungi sekarang." },
      { status: 500 },
    );
  }
}
