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
    const { prompt, language, platform, tone } = await req.json();

    const platformLimits: Record<string, number> = {
      instagram: 2200,
      linkedin: 3000,
      x: 280,
      youtube: 5000,
    };

    const charLimit = platformLimits[platform] || 2000;

    const systemPrompt = `You are Vaani AI, an expert multilingual content creator for Indian businesses and creators. 
You create culturally adapted content (NOT direct translations) for the Indian market.

Rules:
- Language: ${language} (write naturally in this language, not a translation)
- Platform: ${platform} (max ${charLimit} characters)
- Tone: ${tone}
- Include relevant hashtags for Indian audience
- Use cultural references, festivals, local expressions when appropriate
- For Instagram: visual hooks, emojis, hashtags
- For LinkedIn: professional insights, thought leadership
- For X: concise, punchy, thread-worthy
- For YouTube: SEO-optimized title and description

Respond ONLY with valid JSON in this format:
{
  "title": "short title for the post",
  "content": "the full post content within character limits"
}`;

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
          { role: "user", content: `Create a ${platform} post about: ${prompt}` },
        ],
        temperature: 0.8,
      }),
    });

    const aiData = await response.json();
    const raw = aiData.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response
    let parsed;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      parsed = { title: "", content: raw };
    }

    // Generate engagement prediction
    const contentLength = parsed.content?.length || 0;
    const hasHashtags = (parsed.content?.match(/#/g) || []).length;
    const hasEmojis = /[\u{1F300}-\u{1FAD6}]/u.test(parsed.content || "");
    const hasQuestion = parsed.content?.includes("?");

    const baseScore = 40;
    const lengthBonus = contentLength > 100 && contentLength < charLimit * 0.8 ? 15 : 5;
    const hashtagBonus = Math.min(hasHashtags * 3, 15);
    const emojiBonus = hasEmojis ? 8 : 0;
    const questionBonus = hasQuestion ? 7 : 0;
    const viralScore = Math.min(baseScore + lengthBonus + hashtagBonus + emojiBonus + questionBonus + Math.random() * 10, 95);

    const bestTimes: Record<string, string> = {
      instagram: "12:00 PM - 1:00 PM",
      linkedin: "8:00 AM - 10:00 AM",
      x: "6:00 PM - 8:00 PM",
      youtube: "4:00 PM - 6:00 PM",
    };

    const prediction = {
      viralScore: Math.round(viralScore),
      engagementRate: parseFloat((2 + Math.random() * 6).toFixed(1)),
      bestTime: bestTimes[platform] || "10:00 AM - 12:00 PM",
      hookStrength: Math.min(Math.round(5 + (hasQuestion ? 2 : 0) + (hasEmojis ? 1 : 0) + Math.random() * 2), 10),
    };

    return new Response(
      JSON.stringify({ content: parsed.content, title: parsed.title, prediction }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
