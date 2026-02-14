import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic2, Instagram, Linkedin, Twitter, Youtube, ArrowRight, Sparkles, Globe, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import authBg from "@/assets/auth-bg.jpg";

const platformLogos = [
  { icon: Instagram, name: "Instagram", color: "text-pink-500" },
  { icon: Linkedin, name: "LinkedIn", color: "text-blue-500" },
  { icon: Twitter, name: "X (Twitter)", color: "text-foreground" },
  { icon: Youtube, name: "YouTube", color: "text-red-500" },
  { icon: Instagram, name: "Instagram", color: "text-pink-500" },
  { icon: Linkedin, name: "LinkedIn", color: "text-blue-500" },
  { icon: Twitter, name: "X (Twitter)", color: "text-foreground" },
  { icon: Youtube, name: "YouTube", color: "text-red-500" },
];

function PlatformMarquee({ direction = "left" }: { direction?: "left" | "right" }) {
  const items = [...platformLogos, ...platformLogos];
  return (
    <div className="overflow-hidden py-3">
      <motion.div
        className="flex gap-6"
        animate={{ x: direction === "left" ? [0, -50 * platformLogos.length] : [-50 * platformLogos.length, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {items.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/30 bg-card/30 backdrop-blur-sm whitespace-nowrap shrink-0"
          >
            <p.icon className={`h-4 w-4 ${p.color}`} />
            <span className="text-xs font-medium text-foreground/70">{p.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Auth() {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-muted-foreground"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel with background image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={authBg}
          alt="Vaani AI Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Mic2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-primary-foreground">Vaani AI</span>
          </motion.div>

          <div className="space-y-8 max-w-lg">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-heading text-5xl font-bold leading-tight text-primary-foreground"
            >
              Empowering Bharat's
              <br />
              <span className="text-primary">Digital Voice</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-primary-foreground/70 text-lg leading-relaxed"
            >
              AI-powered content intelligence platform for Indian MSMEs and creators.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-3 gap-4 pt-2"
            >
              {[
                { icon: Globe, label: "6 Languages", desc: "Hindi, Tamil, Bengali & more" },
                { icon: Sparkles, label: "AI Powered", desc: "Smart content generation" },
                { icon: BarChart3, label: "Analytics", desc: "Engagement predictions" },
              ].map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.15 }}
                  className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/10"
                >
                  <f.icon className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm font-semibold text-primary-foreground">{f.label}</p>
                  <p className="text-xs text-primary-foreground/50 mt-0.5">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Platform marquee */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <p className="text-xs text-primary-foreground/40 mb-2">Publish across platforms</p>
              <PlatformMarquee direction="left" />
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-xs text-primary-foreground/30"
          >
            © 2026 Vaani AI. Built for Bharat.
          </motion.p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-accent blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm space-y-8 relative z-10"
        >
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Mic2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">Vaani AI</span>
          </div>

          {/* Mobile marquee */}
          <div className="lg:hidden">
            <PlatformMarquee />
          </div>

          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={signInWithGoogle}
              variant="outline"
              size="lg"
              className="w-full h-12 text-sm font-medium gap-3 border-border hover:bg-muted/50 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </motion.div>

          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-6 pt-4"
          >
            {[
              { num: "10K+", label: "Creators" },
              { num: "50K+", label: "Posts Created" },
              { num: "6", label: "Languages" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold font-heading text-foreground">{s.num}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
