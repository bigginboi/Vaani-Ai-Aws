import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Loader2, Repeat2, Copy, Save, ArrowRight } from "lucide-react";

const FORMAT_OPTIONS = [
  { value: "instagram_caption", label: "Instagram Caption" },
  { value: "linkedin_post", label: "LinkedIn Post" },
  { value: "x_thread", label: "X Thread" },
  { value: "youtube_description", label: "YouTube Description" },
  { value: "blog_excerpt", label: "Blog Excerpt" },
];

export default function Repurpose() {
  const { user } = useAuth();
  const [sourceContent, setSourceContent] = useState("");
  const [sourceFormat, setSourceFormat] = useState("blog_excerpt");
  const [targetFormats, setTargetFormats] = useState<string[]>(["instagram_caption"]);
  const [results, setResults] = useState<{ format: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleTarget = (format: string) => {
    setTargetFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  const repurpose = async () => {
    if (!sourceContent.trim()) {
      toast({ title: "Please enter source content", variant: "destructive" });
      return;
    }
    if (targetFormats.length === 0) {
      toast({ title: "Select at least one target format", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("repurpose-content", {
        body: { content: sourceContent, sourceFormat, targetFormats },
      });
      if (error) throw error;
      setResults(data.results || []);
      toast({ title: `Content repurposed to ${targetFormats.length} format(s)!` });
    } catch (err: any) {
      toast({ title: "Repurposing failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async (content: string, format: string) => {
    if (!user) return;
    const platformMap: Record<string, string> = {
      instagram_caption: "instagram",
      linkedin_post: "linkedin",
      x_thread: "x",
      youtube_description: "youtube",
      blog_excerpt: "linkedin",
    };
    await supabase.from("content_drafts").insert({
      user_id: user.id,
      content,
      platform: platformMap[format] || "instagram",
      language: "english",
      tone: "Professional",
      status: "draft",
    });
    toast({ title: "Saved as draft!" });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold">Content Repurposing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Transform one piece of content into multiple platform-ready formats
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Source Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Original Format</Label>
              <Select value={sourceFormat} onValueChange={setSourceFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FORMAT_OPTIONS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Content</Label>
              <Textarea
                placeholder="Paste your blog post, caption, or any content here..."
                value={sourceContent}
                onChange={(e) => setSourceContent(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Convert To</Label>
              <div className="flex flex-wrap gap-2">
                {FORMAT_OPTIONS.filter((f) => f.value !== sourceFormat).map((f) => (
                  <Badge
                    key={f.value}
                    variant={targetFormats.includes(f.value) ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => toggleTarget(f.value)}
                  >
                    {f.label}
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={repurpose} disabled={loading} className="w-full gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Repeat2 className="h-4 w-4" />}
              {loading ? "Repurposing..." : "Repurpose Content"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {results.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Repeat2 className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Repurposed content will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            results.map((result, i) => (
              <Card key={i} className="glass-card animate-scale-in">
                <CardHeader className="pb-2 flex-row items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {FORMAT_OPTIONS.find((f) => f.value === result.format)?.label}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1" onClick={() => { navigator.clipboard.writeText(result.content); toast({ title: "Copied!" }); }}>
                      <Copy className="h-3 w-3" /> Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1" onClick={() => saveDraft(result.content, result.format)}>
                      <Save className="h-3 w-3" /> Save
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{result.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
