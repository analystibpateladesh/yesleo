import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/site/Layout";
import { submitContact } from "@/lib/checkout.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact YesLeo | Support for ChromePro Earphones" },
      {
        name: "description",
        content:
          "Questions about your ChromePro order, returns or bulk enquiries? Message the YesLeo support team and we'll reply within 24 hours.",
      },
      { property: "og:title", content: "Contact YesLeo" },
      { property: "og:description", content: "Support, returns and bulk enquiries." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const send = useServerFn(submitContact);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await send({ data: form });
      toast.success("Message sent — we'll get back to you within 24 hours.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your message.");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-foreground";

  return (
    <Layout>
      <section className="mx-auto grid max-w-5xl gap-12 px-4 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Contact</p>
          <h1 className="mt-3 text-4xl font-bold">Get in touch</h1>
          <p className="mt-3 text-muted-foreground">
            Order help, returns, or bulk orders — drop us a line. Real humans, usually within a day.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4" /> yesleo.one@gmail.com
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4" /> +91 98396 41443
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4" /> Delhi, India
            </li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="surface-card space-y-4 p-6">
          <input
            className={field}
            placeholder="Your name"
            required
            maxLength={80}
            value={form.name}
            onChange={set("name")}
          />
          <input
            className={field}
            type="email"
            placeholder="Email address"
            required
            maxLength={160}
            value={form.email}
            onChange={set("email")}
          />
          <input
            className={field}
            placeholder="Phone (optional)"
            maxLength={20}
            value={form.phone}
            onChange={set("phone")}
          />
          <textarea
            className={`${field} min-h-32`}
            placeholder="How can we help?"
            required
            maxLength={1000}
            value={form.message}
            onChange={set("message")}
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>
    </Layout>
  );
}
