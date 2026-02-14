import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { content, sourceFormat, targetFormats } = await req.json();

    const formatDescriptions: Record<string, string> = {
      instagram_caption: "Instagram caption (max 2200 chars, visual hooks, emojis, 20-30 hashtags, engaging CTA)",
      linkedin_post: "LinkedIn post (max 3000 chars, professional tone, thought leadership, minimal hashtags)",
      x_thread: "X/Twitter thread (each tweet max 280 chars, numbered, punchy, thread format with 1/ 2/ 3/)",
      youtube_description: "YouTube description (SEO keywords, timestamps format, links section, max 5000 chars)",
      blog_excerpt: "Blog excerpt (300-500 words, SEO-friendly, structured with headers)",
    };

    const targetDescList = targetFormats
      .map((f: string) => `- ${f}: ${formatDescriptions[f] || f}`)
      .join("\n");

    const systemPrompt = `You are Vaani AI, a content repurposing expert for the Indian market.
Given source content, adapt it into different platform formats.
Keep the core message but optimize for each platform's audience and format.
Use culturally relevant language for Indian audiences.

Respond ONLY with valid JSON array:
[{"format": "format_name", "content": "repurposed content"}]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Source format: ${sourceFormat}\nSource content:\n${content}\n\nRepurpose into these formats:\n${targetDescList}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const aiData = await response.json();
    const raw = aiData.choices?.[0]?.message?.content || "[]";

    let results;
    try {
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      results = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      results = targetFormats.map((f: string) => ({ format: f, content: raw }));
    }

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
