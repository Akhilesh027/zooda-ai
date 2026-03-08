import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Bot, ArrowRight, MessageSquare, Globe, FileText, Zap,
  Shield, BarChart3, Clock, CheckCircle2, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0, 0, 0.2, 1] as const } }),
};

const features = [
  { icon: Bot, title: "AI Chat Assistant", desc: "Train a chatbot on your business data in minutes." },
  { icon: Globe, title: "Website Crawling", desc: "Automatically extract content from your website." },
  { icon: FileText, title: "PDF Upload", desc: "Upload documents to expand your AI's knowledge." },
  { icon: MessageSquare, title: "Live Chat", desc: "WhatsApp-style chat interface for your users." },
  { icon: Shield, title: "Data Privacy", desc: "Your data stays yours. Enterprise-grade security." },
  { icon: BarChart3, title: "Analytics", desc: "Track conversations and user engagement." },
];

const steps = [
  { num: "01", title: "Create Your Bot", desc: "Enter your business name and connect your website." },
  { num: "02", title: "Upload Data", desc: "Upload PDFs and crawl your website for content." },
  { num: "03", title: "Go Live", desc: "Your AI assistant is ready to chat with customers." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Zooda AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="text-muted-foreground">Admin</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Dashboard <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--gradient-glow)] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6">
              <Zap className="h-3 w-3" /> 15-Day Free Trial — No Credit Card
            </span>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            Turn Your Website Into an
            <br />
            <span className="gradient-text">Intelligent AI Assistant</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            Create a custom AI chatbot trained exclusively on your business data. Upload documents, connect your website, and let AI handle customer conversations 24/7.
          </motion.p>
          <motion.div className="flex items-center justify-center gap-4" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Link to="/dashboard/wizard">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/chat/demo">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base border-border hover:bg-muted/50">
                Try Live Demo
              </Button>
            </Link>
          </motion.div>

          {/* Mock UI Preview */}
          <motion.div
            className="mt-16 max-w-3xl mx-auto rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-1 shadow-2xl"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="rounded-lg bg-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-primary/60" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">zooda-ai-agent.app</span>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-2.5 max-w-md">
                    <p className="text-sm">Hello! Welcome to GreenLeaf Dental Clinic. How can I help you today?</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-md">
                    <p className="text-sm">What services do you offer?</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-2.5 max-w-md">
                    <p className="text-sm">We offer Teeth Cleaning, Dental Implants, and Teeth Whitening services.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Get your AI assistant up and running in three simple steps.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.num} className="glass-hover rounded-xl p-6 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}>
                <span className="text-4xl font-bold gradient-text">{step.num}</span>
                <h3 className="text-lg font-semibold mt-3 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Everything you need to build an intelligent customer support experience.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} className="glass-hover rounded-xl p-6 group" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-muted-foreground">Start free, upgrade when you're ready.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.div className="glass rounded-xl p-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <h3 className="font-semibold text-lg mb-1">Free Trial</h3>
              <p className="text-muted-foreground text-sm mb-4">15 days, full access</p>
              <div className="text-4xl font-bold mb-6">₹0<span className="text-base font-normal text-muted-foreground">/15 days</span></div>
              <ul className="space-y-3 text-sm mb-8">
                {["1 AI Chatbot", "2 PDF Uploads", "Website Crawling", "Chat Analytics"].map(f => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />{f}</li>
                ))}
              </ul>
              <Link to="/dashboard/wizard">
                <Button variant="outline" className="w-full">Start Free Trial</Button>
              </Link>
            </motion.div>
            <motion.div className="rounded-xl p-8 border-2 border-primary/50 bg-primary/5 relative overflow-hidden" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
              <span className="absolute top-4 right-4 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Popular</span>
              <h3 className="font-semibold text-lg mb-1">Premium</h3>
              <p className="text-muted-foreground text-sm mb-4">Unlimited access</p>
              <div className="text-4xl font-bold mb-6">₹2,999<span className="text-base font-normal text-muted-foreground">/month</span></div>
              <ul className="space-y-3 text-sm mb-8">
                {["Everything in Free", "Unlimited Messages", "Priority Support", "Custom Branding", "API Access"].map(f => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />{f}</li>
                ))}
              </ul>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Upgrade Now</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <Bot className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">Zooda AI Agent</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Zooda AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
