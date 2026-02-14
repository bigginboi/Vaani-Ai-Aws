import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const systemPrompt = `You are Vaani AI's Trend Radar. Generate 10 trending topics relevant to Indian MSMEs, creators, and small businesses right now.

Consider:
- Indian festivals and cultural events
- Indian startup ecosystem
- Social media trends in India
- Regional content trends
- Digital India initiatives
- E-commerce trends in India

Respond ONLY with valid JSON array:
[{
  "topic": "topic name",
  "category": "category",
  "region": "India",
  "hashtags": ["hashtag1", "hashtag2"],
  "content_ideas": ["idea 1", "idea 2"],
  "score": 85
}]`;

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
          { role: "user", content: "Generate the latest trending topics for Indian content creators and MSMEs for today." },
        ],
        temperature: 0.9,
      }),
    });

    const aiData = await response.json();
    const raw = aiData.choices?.[0]?.message?.content || "[]";

    let topics;
    try {
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      topics = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      topics = [];
    }

    // Clear old and insert new
    await supabase.from("trending_topics").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    if (topics.length > 0) {
      await supabase.from("trending_topics").insert(
        topics.map((t: any) => ({
          topic: t.topic,
          category: t.category || null,
          region: t.region || "India",
          hashtags: t.hashtags || [],
          content_ideas: t.content_ideas || [],
          score: t.score || null,
          source: "ai-generated",
        }))
      );
    }

    return new Response(
      JSON.stringify({ success: true, count: topics.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
