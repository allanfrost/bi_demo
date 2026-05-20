import type { KPI } from "@/lib/mock-data"

type BriefingUser = {
  name: string
  title: string
}

const SYSTEM_PROMPT = `Du er en erfaren BI-analytiker der skriver ledelsesrapporter for danske virksomheder.
Du modtager nøgletal og skriver en kort, præcis og professionel ledelsesbriefing på dansk.
Skriv i sammenhængende afsnit — ingen bullet points, ingen overskrifter.
Max 3 afsnit. Vær konkret om tallene. Det vigtigste først.
Afslut med én konkret anbefaling til ledelsen.`

// The original spec model is unavailable for some API keys, so default to the account's current Sonnet model.
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6"

function buildKpiMessage(kpis: KPI[], user?: BriefingUser) {
  const userContext = user
    ? `Briefingen genereres for ${user.name}, ${user.title}.\n\n`
    : ""

  return `${userContext}Skriv en ledelsesbriefing ud fra disse nøgletal:\n\n${kpis
    .map(
      (kpi) =>
        `${kpi.label}: ${kpi.formatted}, trend ${kpi.trendLabel}, status ${kpi.status}. ${kpi.description}`
    )
    .join("\n")}`
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY mangler" },
      { status: 500 }
    )
  }

  const { kpis, user } = (await request.json()) as {
    kpis?: KPI[]
    user?: BriefingUser
  }

  if (!kpis?.length) {
    return Response.json({ error: "Nøgletal mangler" }, { status: 400 })
  }

  const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 700,
      stream: true,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildKpiMessage(kpis, user)
        }
      ]
    })
  })

  if (!anthropicResponse.ok || !anthropicResponse.body) {
    const errorBody = (await anthropicResponse.json().catch(() => null)) as {
      error?: { message?: string }
    } | null

    return Response.json(
      {
        error:
          errorBody?.error?.message ??
          "Briefing kunne ikke genereres"
      },
      { status: anthropicResponse.status || 500 }
    )
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = anthropicResponse.body!.getReader()
      const decoder = new TextDecoder()
      const encoder = new TextEncoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          if (!line.startsWith("data: ")) {
            continue
          }

          const data = line.slice(6)

          if (data === "[DONE]") {
            controller.close()
            return
          }

          try {
            const event = JSON.parse(data) as {
              type?: string
              delta?: { text?: string }
            }

            if (event.type === "content_block_delta" && event.delta?.text) {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          } catch {
            // Ignore partial SSE payloads; the next chunk completes them.
          }
        }
      }

      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache"
    }
  })
}
