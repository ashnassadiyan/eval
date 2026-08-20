"use client";

import { useState } from "react";
import { 
  X, 
  Send, 
  Sparkles, 
  Building2, 
  Mail, 
  Phone, 
  User, 
  CheckCircle2, 
  Bot, 
  CreditCard 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ServiceInquiryModal({ isOpen, onClose, defaultService = "both" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: defaultService,
    teamSize: "1-10",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill in your name and email address.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      toast.success("Inquiry submitted! Our SME Automation specialist will reach out within 24 hours.");
    }, 800);
  };

  const handleResetAndClose = () => {
    setSubmittedSuccess(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      serviceType: defaultService,
      teamSize: "1-10",
      message: ""
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-foreground leading-tight">
                Request Service Consultation
              </h3>
              <p className="text-xs text-muted-foreground">
                SME Business Automation & Custom NFC Card Solutions
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submittedSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-extrabold text-foreground">Inquiry Received!</h4>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Thank you, <span className="font-semibold text-foreground">{formData.name}</span>. A dedicated automation & digital branding engineer will contact you at <span className="font-semibold text-foreground">{formData.email}</span> shortly.
                </p>
              </div>
              <div className="pt-4">
                <Button onClick={handleResetAndClose} className="px-6 font-bold">
                  Close Window
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Selection Pills */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">
                  Service Category Interest:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "automation", label: "SME Automation", icon: Bot },
                    { id: "nfc", label: "Smart NFC Cards", icon: CreditCard },
                    { id: "both", label: "Both Services", icon: Sparkles }
                  ].map((s) => {
                    const Icon = s.icon;
                    const isSelected = formData.serviceType === s.id;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setFormData({ ...formData, serviceType: s.id })}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-muted/40 hover:bg-muted border-border/60 text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Company */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Company / Enterprise Name</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Evolytics Partner"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Work Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Phone / WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Project Details or Custom Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your automation workflow goals, CRM tools used, or NFC card quantity & branding requests..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={isSubmitting} className="w-full font-bold py-5 text-sm">
                  {isSubmitting ? (
                    "Sending Inquiry..."
                  ) : (
                    <>
                      Submit Request & Book Consultation
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
