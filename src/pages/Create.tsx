import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Copy, Save, TrendingUp, Clock, Zap, Target } from "lucide-react";

const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "hindi", label: "हिंदी (Hindi)" },
  { value: "bengali", label: "বাংলা (Bengali)" },
  { value: "tamil", label: "தமிழ் (Tamil)" },
  { value: "marathi", label: "मराठी (Marathi)" },
  { value: "assamese", label: "অসমীয়া (Assamese)" },
];

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "x", label: "X (Twitter)" },
  { value: "youtube", label: "YouTube" },
];

const TONES = [
  { value: "Professional", label: "Professional" },
  { value: "Friendly", label: "Friendly" },
  { value: "Promotional", label: "Promotional" },
  { value: "Educational", label: "Educational" },
];

export default function Create() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("english");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("Professional");
  const [generatedContent, setGeneratedContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [prediction, setPrediction] = useState<{
    viralScore: number;
    engagementRate: number;
    bestTime: string;
    hookStrength: number;
  } | null>(null);

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast({ title: "Please enter a topic or prompt", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { prompt, language, platform, tone },
      });
      if (error) throw error;
      setGeneratedContent(data.content);
      setTitle(data.title || "");
      setPrediction(data.prediction);
      toast({ title: "Content generated successfully!" });
    } catch (err: any) {
      toast({ title: "Failed to generate content", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async () => {
    if (!generatedContent.trim() || !user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("content_drafts").insert({
        user_id: user.id,
        title: title || null,
        content: generatedContent,
        platform,
        language,
        tone,
        prompt,
        viral_score: prediction?.viralScore || null,
        engagement_prediction: prediction || {},
        status: "draft",
      });
      if (error) throw error;
      toast({ title: "Draft saved!" });
    } catch (err: any) {
      toast({ title: "Failed to save draft", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(generatedContent);
    toast({ title: "Copied to clipboard!" });
  }, [generatedContent]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold">AI Content Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create culturally adapted, multilingual content for any platform
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Content Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Topic / Prompt</Label>
              <Textarea
                placeholder="e.g., Diwali sale announcement for our handmade candle business..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={generateContent} disabled={loading} className="w-full gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Generating..." : "Generate Content"}
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <div className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-base">Generated Content</CardTitle>
              {generatedContent && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 text-xs gap-1">
                    <Copy className="h-3 w-3" /> Copy
                  </Button>
                  <Button variant="ghost" size="sm" onClick={saveDraft} disabled={saving} className="h-8 text-xs gap-1">
                    <Save className="h-3 w-3" /> {saving ? "Saving..." : "Save Draft"}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="space-y-3">
                  {title && (
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="font-medium"
                      placeholder="Title"
                    />
                  )}
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="min-h-[250px] resize-none"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Sparkles className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Your AI-generated content will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Engagement Prediction */}
          {prediction && (
            <Card className="glass-card animate-scale-in">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Engagement Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Viral Score", value: `${prediction.viralScore}%`, icon: TrendingUp, color: "text-primary" },
                    { label: "Engagement Rate", value: `${prediction.engagementRate}%`, icon: Zap, color: "text-accent" },
                    { label: "Best Time (IST)", value: prediction.bestTime, icon: Clock, color: "text-warning" },
                    { label: "Hook Strength", value: `${prediction.hookStrength}/10`, icon: Target, color: "text-info" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50">
                      <item.icon className={`h-4 w-4 ${item.color} shrink-0`} />
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-semibold">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
