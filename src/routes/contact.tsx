import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Jowi Exporters Limited" },
      {
        name: "description",
        content:
          "Get in touch with Jowi Exporters Limited for quotes, samples and partnership enquiries. Based at JKIA, Nairobi, Kenya — exporting worldwide.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim() || null,
      phone: String(fd.get("phone") ?? "").trim() || null,
      message: String(fd.get("message") ?? "").trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("Could not send. Please try again.");
      return;
    }
    toast.success("Message sent. We'll be in touch shortly.");
    form.reset();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary to-secondary/60 text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary-foreground/70">Contact</p>
            <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Let's talk exports</h1>
            <p className="mt-3 max-w-xl text-primary-foreground/85">
              Request a quote, book a sample shipment, or just say hello — we read every message.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="space-y-6 lg:col-span-2">
            <ContactItem icon={MapPin} title="Office">
              Jomo Kenyatta Intl. Airport<br />Logistics Hub, Nairobi, Kenya
            </ContactItem>
            <ContactItem icon={Phone} title="Phone">+254 700 000 000</ContactItem>
            <ContactItem icon={Mail} title="Email">hello@jowiexporters.com</ContactItem>
            <div className="rounded-2xl border border-border/70 bg-accent/30 p-5 text-sm text-muted-foreground">
              <strong className="text-foreground">Office hours:</strong><br />
              Mon – Fri, 7:00 – 19:00 EAT<br />
              Sat, 8:00 – 14:00 EAT
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 lg:col-span-3"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Company" name="company" />
              <Field label="Phone" name="phone" />
            </div>
            <div className="mt-4">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell us about your destination, volumes and timeline."
                className="mt-1.5"
              />
            </div>
            <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto" disabled={loading}>
              {loading ? "Sending…" : "Send message"}
            </Button>
          </form>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({
  label, name, type = "text", required,
}: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <Label htmlFor={name}>{label}{required && <span className="text-destructive"> *</span>}</Label>
      <Input id={name} name={name} type={type} required={required} className="mt-1.5" />
    </div>
  );
}

function ContactItem({
  icon: Icon, title, children,
}: { icon: typeof MapPin; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
