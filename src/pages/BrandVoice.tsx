import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Mic2, Trash2, Edit } from "lucide-react";

export default function BrandVoice() {
  const { user } = useAuth();
  const [voices, setVoices] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", tone: "Professional", sample_content: "" });

  useEffect(() => {
    if (!user) return;
    fetchVoices();
  }, [user]);

  const fetchVoices = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("brand_voices")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setVoices(data || []);
  };

  const saveVoice = async () => {
    if (!form.name.trim() || !user) return;
    const { error } = await supabase.from("brand_voices").insert({
      user_id: user.id,
      name: form.name,
      description: form.description || null,
      tone: form.tone,
      sample_content: form.sample_content || null,
    });
    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Brand voice saved!" });
    setForm({ name: "", description: "", tone: "Professional", sample_content: "" });
    setOpen(false);
    fetchVoices();
  };

  const deleteVoice = async (id: string) => {
    await supabase.from("brand_voices").delete().eq("id", id);
    setVoices(voices.filter((v) => v.id !== id));
    toast({ title: "Brand voice deleted" });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Brand Voice</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Define your brand tone to generate consistent content
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Add Voice
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Brand Voice</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs">Brand Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., My Chai Business" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of your brand" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Default Tone</Label>
                <Select value={form.tone} onValueChange={(v) => setForm({ ...form, tone: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Promotional">Promotional</SelectItem>
                    <SelectItem value="Educational">Educational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Sample Content (paste past posts or website copy)</Label>
                <Textarea
                  value={form.sample_content}
                  onChange={(e) => setForm({ ...form, sample_content: e.target.value })}
                  placeholder="Paste examples of your brand's writing style..."
                  className="min-h-[120px]"
                />
              </div>
              <Button onClick={saveVoice} className="w-full">Save Brand Voice</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {voices.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Mic2 className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No brand voices yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Add your first brand voice to personalize AI content</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {voices.map((voice) => (
            <Card key={voice.id} className="glass-card">
              <CardContent className="p-5 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{voice.name}</h3>
                  {voice.description && <p className="text-xs text-muted-foreground mt-1">{voice.description}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{voice.tone}</span>
                    {voice.sample_content && (
                      <span className="text-[10px] text-muted-foreground">Has sample content</span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => deleteVoice(voice.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
