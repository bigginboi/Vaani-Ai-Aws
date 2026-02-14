import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, Trash2, Instagram, Linkedin, Twitter } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const platformIcons: Record<string, any> = {
  instagram: Instagram,
  linkedin: Linkedin,
  x: Twitter,
  youtube: Clock,
};

const platformColors: Record<string, string> = {
  instagram: "bg-pink-500/10 text-pink-600",
  linkedin: "bg-blue-600/10 text-blue-600",
  x: "bg-foreground/10 text-foreground",
  youtube: "bg-red-500/10 text-red-600",
};

export default function Schedule() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("scheduled_posts")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_time", { ascending: true });
      setPosts(data || []);
    };
    fetchPosts();
  }, [user]);

  const deletePost = async (id: string) => {
    const { error } = await supabase.from("scheduled_posts").delete().eq("id", id);
    if (!error) {
      setPosts(posts.filter((p) => p.id !== id));
      toast({ title: "Post removed from schedule" });
    }
  };

  const filteredPosts = selectedDate
    ? posts.filter((p) => format(new Date(p.scheduled_time), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"))
    : posts;

  const scheduledDates = posts.map((p) => new Date(p.scheduled_time));

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold">Content Scheduler</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Plan and schedule your posts across platforms
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="glass-card lg:col-span-1">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ scheduled: scheduledDates }}
              modifiersStyles={{ scheduled: { fontWeight: "bold", textDecoration: "underline", color: "hsl(var(--primary))" } }}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Posts List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold font-heading">
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "All Scheduled Posts"}
            </h2>
            <Badge variant="secondary">{filteredPosts.length} posts</Badge>
          </div>

          {filteredPosts.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Clock className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No posts scheduled for this date</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Create content and schedule it from the Create page</p>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => {
              const Icon = platformIcons[post.platform] || Clock;
              return (
                <Card key={post.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${platformColors[post.platform] || ""}`}>
                            <Icon className="h-3 w-3" />
                            {post.platform}
                          </span>
                          <Badge variant={post.status === "published" ? "default" : "secondary"} className="text-[10px]">
                            {post.status}
                          </Badge>
                        </div>
                        <p className="text-sm line-clamp-2">{post.content}</p>
                        <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(post.scheduled_time), "hh:mm a")} IST
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => deletePost(post.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
