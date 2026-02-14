import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Heart, MessageCircle, Share2, Eye, TrendingUp, ArrowUpRight } from "lucide-react";

export default function Analytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [totals, setTotals] = useState({ likes: 0, comments: 0, shares: 0, reach: 0 });

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("analytics_data")
        .select("*")
        .eq("user_id", user.id)
        .order("recorded_at", { ascending: true })
        .limit(30);
      const rows = data || [];
      setAnalytics(rows);
      setTotals({
        likes: rows.reduce((s, r) => s + (r.likes || 0), 0),
        comments: rows.reduce((s, r) => s + (r.comments || 0), 0),
        shares: rows.reduce((s, r) => s + (r.shares || 0), 0),
        reach: rows.reduce((s, r) => s + (r.reach || 0), 0),
      });
    };
    fetch();
  }, [user]);

  const statCards = [
    { label: "Total Likes", value: totals.likes, icon: Heart, color: "text-pink-500" },
    { label: "Comments", value: totals.comments, icon: MessageCircle, color: "text-info" },
    { label: "Shares", value: totals.shares, icon: Share2, color: "text-accent" },
    { label: "Reach", value: totals.reach, icon: Eye, color: "text-warning" },
  ];

  const chartData = analytics.map((a, i) => ({
    name: `Day ${i + 1}`,
    likes: a.likes || 0,
    comments: a.comments || 0,
    engagement: a.engagement_rate || 0,
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track performance and get AI-powered insights
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <ArrowUpRight className="h-3 w-3 text-accent" />
              </div>
              <p className="text-2xl font-bold font-heading">{stat.value.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      {analytics.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Engagement Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="likes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="comments" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Engagement Rate Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="engagement" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <TrendingUp className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No analytics data yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Start publishing content to see your performance metrics
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
