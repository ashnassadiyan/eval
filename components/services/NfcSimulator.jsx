"use client";

import { useState } from "react";
import { 
  Instagram, 
  Linkedin, 
  Share2, 
  Star, 
  PhoneCall, 
  MessageSquare, 
  Globe, 
  UserCheck, 
  Smartphone, 
  Wifi, 
  Sparkles, 
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function NfcSimulator() {
  const [activeProfile, setActiveProfile] = useState("google_reviews");
  const [cardTheme, setCardTheme] = useState("black");
  const [isTapping, setIsTapping] = useState(false);

  const profiles = {
    google_reviews: {
      title: "5-Star Google Reviews Booster",
      category: "Customer Feedback & Reputation",
      bgGradient: "from-blue-600 via-indigo-600 to-purple-600",
      icon: Star,
      actionText: "Tap opens instant 5-Star Review Modal",
      stats: "+340% Review Rate Increase",
      screen: {
        header: "Evolytics Bistro & Lounge",
        sub: "Rate your experience in 1 tap!",
        stars: 5,
        badge: "Verified Google Business",
        buttonText: "Leave 5-Star Review",
        description: "Thank you for visiting us! Tap below to share your experience on Google."
      }
    },
    instagram: {
      title: "Instagram & TikTok Growth",
      category: "Social Account Follower Accelerator",
      bgGradient: "from-pink-500 via-rose-500 to-amber-500",
      icon: Instagram,
      actionText: "Opens Instagram App Directly",
      stats: "+5x Profile Visits",
      screen: {
        header: "@EvolyticsOfficial",
        sub: "12.4k Followers • Official Page",
        badge: "Social Media Hub",
        buttonText: "Follow on Instagram",
        description: "Explore our latest collections, behind-the-scenes stories, and exclusive daily deals."
      }
    },
    vcard: {
      title: "Smart Digital Business Card",
      category: "Instant Contact Save (vCard)",
      bgGradient: "from-slate-800 to-zinc-900",
      icon: UserCheck,
      actionText: "Saves Contact directly to Phone Book",
      stats: "0 Paper Waste",
      screen: {
        header: "Sarah Jenkins",
        sub: "Head of Operations, Evolytics",
        badge: "Direct Contact Card",
        buttonText: "Save Contact to Phone",
        description: "Mobile: +1 (555) 234-8900\nEmail: s.jenkins@evolytics.com\nOffice: New York, NY"
      }
    },
    linkedin: {
      title: "Professional LinkedIn Connect",
      category: "B2B Networking & Executives",
      bgGradient: "from-blue-700 to-sky-600",
      icon: Linkedin,
      actionText: "Direct Connect on LinkedIn",
      stats: "Instant Connection",
      screen: {
        header: "Evolytics Enterprise Solutions",
        sub: "B2B Automation & Tech",
        badge: "LinkedIn Company Hub",
        buttonText: "Connect on LinkedIn",
        description: "Empowering 500+ SMEs with automated business workflows and modern digital solutions."
      }
    },
    whatsapp: {
      title: "WhatsApp Direct Lead Chat",
      category: "Instant Customer Communication",
      bgGradient: "from-emerald-600 to-teal-700",
      icon: MessageSquare,
      actionText: "Launches Pre-filled Chat Window",
      stats: "< 2 Minute Response Time",
      screen: {
        header: "Evolytics Support & Sales",
        sub: "Instant Consultation Available",
        badge: "Official WhatsApp Business",
        buttonText: "Start WhatsApp Chat",
        description: "Hi! How can we help automate your business today? Click to start chatting instantly."
      }
    }
  };

  const current = profiles[activeProfile];

  const handleSimulateTap = (key) => {
    setActiveProfile(key);
    setIsTapping(true);
    setTimeout(() => setIsTapping(false), 500);
  };

  return (
    <div className="w-full bg-card border border-border/80 rounded-2xl p-6 md:p-10 shadow-xl overflow-hidden relative">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="px-3.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 inline-flex items-center gap-1.5 mb-3">
          <Wifi className="w-3.5 h-3.5 animate-pulse" /> Live Tap Simulator
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Experience NFC Smart Cards in Action
        </h3>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Select a profile goal below to simulate how tapping your physical custom card instantly launches social links, Google reviews, or contact cards on any smartphone.
        </p>
      </div>

      {/* Target Selector Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {Object.entries(profiles).map(([key, data]) => {
          const Icon = data.icon;
          const isActive = activeProfile === key;
          return (
            <button
              key={key}
              onClick={() => handleSimulateTap(key)}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 border ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                  : "bg-muted/60 hover:bg-muted text-muted-foreground border-border/60 hover:text-foreground"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
              <span>{data.title.split(" ")[0]} {data.title.split(" ")[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
        {/* Left Side: Dynamic Physical NFC Card */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Physical NFC Smart Card
          </div>

          {/* Card Skin Selector */}
          <div className="flex items-center gap-2 mb-2">
            {[
              { id: "black", name: "Matte Black", bg: "bg-zinc-900 border-zinc-700" },
              { id: "gold", name: "Brushed Gold", bg: "bg-gradient-to-tr from-amber-600 to-yellow-400 border-yellow-300" },
              { id: "silver", name: "Silver Chrome", bg: "bg-gradient-to-tr from-slate-300 via-gray-100 to-slate-400 border-slate-300" },
              { id: "cyber", name: "Cyber Neon", bg: "bg-gradient-to-tr from-purple-900 via-indigo-900 to-blue-900 border-indigo-500" },
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => setCardTheme(theme.id)}
                className={`w-6 h-6 rounded-full ${theme.bg} border-2 transition-transform ${
                  cardTheme === theme.id ? "scale-125 ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-80 hover:opacity-100"
                }`}
                title={theme.name}
              />
            ))}
          </div>

          {/* Physical Card Mockup */}
          <div
            className={`w-72 h-44 rounded-2xl p-5 shadow-2xl relative flex flex-col justify-between transition-all duration-300 transform ${
              isTapping ? "scale-95 translate-y-2" : "hover:scale-[1.02]"
            } ${
              cardTheme === "black"
                ? "bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white border border-zinc-800 shadow-zinc-950/50"
                : cardTheme === "gold"
                ? "bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 text-amber-950 border border-yellow-400 shadow-amber-900/30"
                : cardTheme === "silver"
                ? "bg-gradient-to-br from-slate-200 via-slate-100 to-gray-300 text-slate-900 border border-white shadow-slate-400/30"
                : "bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white border border-indigo-500/40 shadow-purple-950/50"
            }`}
          >
            {/* Wireless NFC Signal Waves */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-80">
              <Wifi className="w-5 h-5 rotate-90" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xs">
                  EV
                </div>
                <span className="font-bold tracking-wider text-xs opacity-90">Evolytics NFC</span>
              </div>
              <p className="text-[10px] mt-1 opacity-70 font-mono tracking-widest">SMART ENTERPRISE CARD</p>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-sm tracking-tight">{current.screen.header}</p>
              <p className="text-[11px] opacity-80 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Embedded Dynamic Chip
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              No App Required • Works on iOS & Android
            </p>
          </div>
        </div>

        {/* Right Side: Simulated Smartphone Screen */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-blue-500" /> Receiver Smartphone Screen
          </div>

          {/* Smartphone Frame */}
          <div className="w-64 md:w-72 bg-zinc-950 rounded-[36px] p-3 border-4 border-zinc-800 shadow-2xl relative">
            {/* Phone Notch */}
            <div className="w-24 h-4 bg-zinc-900 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-zinc-950 border border-zinc-800" />
            </div>

            {/* Screen Content */}
            <div className="bg-background rounded-[28px] overflow-hidden p-4 min-h-[340px] flex flex-col justify-between border border-border/50 text-foreground relative">
              
              {/* Header Badge */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
                    {current.screen.badge}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-lg leading-tight">{current.screen.header}</h4>
                  <p className="text-xs text-muted-foreground">{current.screen.sub}</p>
                </div>

                {/* Rating Stars if google reviews */}
                {activeProfile === "google_reviews" && (
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                    <span className="text-xs font-bold text-foreground ml-1">5.0 (240+ Reviews)</span>
                  </div>
                )}

                {/* Description Text */}
                <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed bg-muted/50 p-2.5 rounded-lg border border-border/40">
                  {current.screen.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 space-y-2">
                <Button className={`w-full text-xs font-bold bg-gradient-to-r ${current.bgGradient} text-white hover:opacity-90 shadow-md`}>
                  {current.screen.buttonText}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
                <p className="text-[10px] text-center text-muted-foreground">
                  ⚡ Dynamic redirection instantly triggers on tap
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Bullet Points footer */}
      <div className="mt-10 pt-6 border-t border-border/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="space-y-1">
          <p className="text-xs font-bold text-foreground">Custom Laser Engraved</p>
          <p className="text-[11px] text-muted-foreground">Your business logo & QR included</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-foreground">Dynamic Link Cloud</p>
          <p className="text-[11px] text-muted-foreground">Change links anytime from dashboard</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-foreground">Waterproof & Durable</p>
          <p className="text-[11px] text-muted-foreground">Built to last 100,000+ taps</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-foreground">Analytics Included</p>
          <p className="text-[11px] text-muted-foreground">Track tap counts & customer leads</p>
        </div>
      </div>
    </div>
  );
}
