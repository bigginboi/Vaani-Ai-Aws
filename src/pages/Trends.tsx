import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Hash, Lightbulb, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Trends() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    const { data } = await supabase
      .from("trending_topics")
      .select("*")
      .order("score", { ascending: false })
      .limit(20);
    setTopics(data || []);
  };

  const refreshTopics = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("fetch-trends");
      if (error) throw error;
      await fetchTopics();
      toast({ title: "Trends refreshed!" });
    } catch (err: any) {
      toast({ title: "Failed to refresh", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Trend Radar</h1>
          <p className="text-sm text-muted-foreground mt-1">
            India-focused trending topics and content ideas
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refreshTopics} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {topics.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <TrendingUp className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No trending topics yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Click refresh to fetch the latest trends</p>
            <Button onClick={refreshTopics} disabled={loading} className="mt-4" size="sm">
              Fetch Trends
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {topics.map((topic) => (
            <Card key={topic.id} className="glass-card hover:bg-muted/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <h3 className="font-medium text-sm">{topic.topic}</h3>
                      {topic.score && (
                        <Badge variant="secondary" className="text-[10px]">
                          Score: {topic.score}
                        </Badge>
                      )}
                    </div>
                    {topic.category && (
                      <p className="text-xs text-muted-foreground mb-2">{topic.category} • {topic.region}</p>
                    )}
                    {topic.hashtags && topic.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {topic.hashtags.map((tag: string, i: number) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary flex items-center gap-0.5">
                            <Hash className="h-2.5 w-2.5" />{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {topic.content_ideas && topic.content_ideas.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {topic.content_ideas.map((idea: string, i: number) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <Lightbulb className="h-3 w-3 text-warning shrink-0 mt-0.5" />
                            <span>{idea}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
