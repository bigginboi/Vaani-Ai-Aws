import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  PenSquare, Calendar, BarChart3, TrendingUp, FileText, Clock, Zap, ArrowRight,
  Instagram, Linkedin, Twitter, Youtube, Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import dashboardHero from "@/assets/dashboard-hero.jpg";

const platforms = [
  { icon: Instagram, name: "Instagram", color: "text-pink-500", bg: "bg-pink-500/10" },
  { icon: Linkedin, name: "LinkedIn", color: "text-blue-600", bg: "bg-blue-600/10" },
  { icon: Twitter, name: "X", color: "text-foreground", bg: "bg-muted" },
  { icon: Youtube, name: "YouTube", color: "text-red-500", bg: "bg-red-500/10" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ drafts: 0, scheduled: 0, published: 0 });
  const [recentDrafts, setRecentDrafts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const [draftsRes, scheduledRes, publishedRes] = await Promise.all([
        supabase.from("content_drafts").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("scheduled_posts").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "scheduled"),
        supabase.from("scheduled_posts").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "published"),
      ]);
      setStats({
        drafts: draftsRes.count || 0,
        scheduled: scheduledRes.count || 0,
        published: publishedRes.count || 0,
      });
    };

    const fetchDrafts = async () => {
      const { data } = await supabase
        .from("content_drafts")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(5);
      setRecentDrafts(data || []);
    };

    fetchStats();
    fetchDrafts();
  }, [user]);

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Creator";

  const quickActions = [
    { label: "Create Content", icon: PenSquare, path: "/create", color: "bg-primary" },
    { label: "Schedule Post", icon: Calendar, path: "/schedule", color: "bg-accent" },
    { label: "View Analytics", icon: BarChart3, path: "/analytics", color: "bg-info" },
    { label: "Trend Radar", icon: TrendingUp, path: "/trends", color: "bg-warning" },
  ];

  const statItems = [
    { label: "Drafts", value: stats.drafts, icon: FileText, color: "text-primary" },
    { label: "Scheduled", value: stats.scheduled, icon: Clock, color: "text-warning" },
    { label: "Published", value: stats.published, icon: Zap, color: "text-accent" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <img src={dashboardHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        <div className="relative z-10 p-8 md:p-10">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground">
            Namaste, {firstName} 🙏
          </h1>
          <p className="text-sm text-primary-foreground/70 mt-1 max-w-md">
            Here's your content intelligence overview for today. Create, schedule, and grow your digital presence.
          </p>
          <Button
            onClick={() => navigate("/create")}
            className="mt-4 gap-2"
            size="sm"
          >
            <Sparkles className="h-4 w-4" /> Create New Content
          </Button>
        </div>
      </motion.div>

      {/* Platform Ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="overflow-hidden"
      >
        <div className="flex gap-3 animate-marquee">
          {[...platforms, ...platforms, ...platforms].map((p, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border ${p.bg} shrink-0 hover-scale cursor-pointer`}
            >
              <p.icon className={`h-4 w-4 ${p.color}`} />
              <span className="text-xs font-medium text-foreground">{p.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statItems.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <Card className="glass-card hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`p-2.5 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-heading">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-heading text-base font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-2.5 p-5 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all text-center"
            >
              <div className={`p-2.5 rounded-lg ${action.color}`}>
                <action.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Drafts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-base font-semibold">Recent Drafts</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/create")} className="text-xs gap-1">
            View All <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
        {recentDrafts.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <PenSquare className="h-10 w-10 text-muted-foreground/40 mb-3" />
              </motion.div>
              <p className="text-sm font-medium text-muted-foreground">No drafts yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Start creating multilingual content with AI
              </p>
              <Button onClick={() => navigate("/create")} className="mt-4" size="sm">
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentDrafts.map((draft, i) => (
              <motion.div
                key={draft.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Card className="glass-card hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate("/create")}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{draft.title || draft.content.slice(0, 60)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{draft.platform}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{draft.language}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
