import { AI_BUILDER_SYSTEM_PROMPT, buildGenerationPrompt } from "@/ai/prompts";
import { generateDeterministicSite } from "@/ai/generator";
import { env } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";

function sse(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

async function fallbackStream(prompt: string) {
  const encoder = new TextEncoder();
  const generated = generateDeterministicSite(prompt);
  const chunks = [
    { type: "agent", step: "Planner", status: "Complete", detail: generated.steps[0].detail },
    { type: "agent", step: "UI generator", status: "Complete", detail: generated.steps[1].detail },
    { type: "delta", delta: `${generated.summary}\n\n` },
    { type: "delta", delta: "Created a premium dark landing page structure with reusable React files.\n" },
    { type: "files", files: generated.files },
    { type: "done", result: generated },
  ];

  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(sse(chunk)));
        await new Promise((resolve) => setTimeout(resolve, 180));
      }
      controller.close();
    },
  });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limited = await rateLimit(`ai:stream:${ip}`, 30, 60);
  if (!limited.success) {
    return Response.json({ error: "Rate limit exceeded." }, { status: 429 });
  }

  const body = (await request.json()) as {
    prompt?: string;
    projectName?: string;
    files?: Array<{ path: string; content: string }>;
  };
  const prompt = body.prompt?.trim();
  if (!prompt) {
    return Response.json({ error: "prompt is required." }, { status: 400 });
  }

  if (!env.OPENAI_API_KEY) {
    return new Response(await fallbackStream(prompt), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store",
        Connection: "keep-alive",
      },
    });
  }

  const upstream = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      instructions: AI_BUILDER_SYSTEM_PROMPT,
      input: buildGenerationPrompt({
        prompt,
        projectName: body.projectName,
        existingFiles: body.files,
      }),
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text();
    return Response.json(
      { error: `OpenAI request failed: ${upstream.status}`, detail },
      { status: 502 },
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    },
  });
}
