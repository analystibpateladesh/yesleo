import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Zap, Waves, Droplets, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PRODUCT, inr } from "@/lib/product";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YesLeo — ChromePro Type-C Wired Earphones at ₹599" },
      {
        name: "description",
        content:
          "Mirror-chrome Type-C wired earphones with a 14.2mm hand-tuned driver, zero latency and IPX5 protection. ₹599, free shipping, 7-day returns.",
      },
      { property: "og:title", content: "YesLeo — ChromePro Type-C Wired Earphones" },
      {
        property: "og:description",
        content: "Mirror-finish sound. Molded to move. ₹599 with free shipping across India.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <Layout>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div>
          <span className="inline-flex rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            New · Type-C
          </span>
          <h1 className="mt-5 text-5xl font-bold leading-[1.05] sm:text-6xl">
            Mirror-finish sound.
            <br />
            <span className="text-muted-foreground">Molded to move.</span>
          </h1>
          <p className="mt-5 max-w-md text-muted-foreground">
            ChromePro packs a 14.2mm hand-tuned dynamic driver into an electroplated chrome shell.
            Plug in, press play — no pairing, no charging, no latency.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/product/$slug"
              params={{ slug: "chromepro" }}
              className="rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Buy now — {inr(PRODUCT.price)}
            </Link>
            <Link
              to="/shop"
              className="rounded-full border border-border px-7 py-4 text-sm font-semibold hover:bg-muted"
            >
              Visit store
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-current text-foreground" />
              ))}
            </span>
            {PRODUCT.rating}/5 from {PRODUCT.reviewCount} verified buyers
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-muted">
          <img
            src={PRODUCT.images[0]!}
            alt="ChromePro Type-C wired earphones in their case"
            width={1200}
            height={1200}
            className="aspect-square w-full object-cover"
          />
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
          {[
            [Zap, "Zero latency", "Direct Type-C connection — no pairing, no charging, ever."],
            [Waves, "14.2mm driver", "Hand-tuned across 200+ passes for deep bass, clean vocals."],
            [Droplets, "IPX5 rated", "Sweat and splash resistant on a durable 1m TPE cable."],
          ].map(([Icon, title, body], i) => {
            const I = Icon as typeof Zap;
            return (
              <div key={i}>
                <I className="h-5 w-5" />
                <h3 className="mt-3 font-semibold">{title as string}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{body as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Showcase */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="ink-panel overflow-hidden rounded-3xl md:grid md:grid-cols-2">
          <img
            src={PRODUCT.images[3]!}
            alt="ChromePro earphones detail shot"
            width={1600}
            height={1008}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="p-10">
            <h2 className="text-3xl font-bold">Built like hardware, tuned like an instrument.</h2>
            <p className="mt-4 text-sm opacity-75">{PRODUCT.description}</p>
            <ul className="mt-6 space-y-2 text-sm opacity-85">
              {PRODUCT.highlights.map((h) => (
                <li key={h}>· {h}</li>
              ))}
            </ul>
            <Link
              to="/product/$slug"
              params={{ slug: "chromepro" }}
              className="mt-8 inline-flex rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground hover:opacity-90"
            >
              See full specs
            </Link>
          </div>
        </div>
      </section>

      {/* Pack offers */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <h2 className="text-3xl font-bold">Pick your pack</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {PRODUCT.variants.map((v) => (
            <div key={v.id} className="surface-card p-6">
              <h3 className="text-lg font-semibold">{v.label}</h3>
              <p className="text-sm text-muted-foreground">{v.sub}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold">{inr(v.price)}</span>
                <span className="text-muted-foreground line-through">{inr(v.mrp)}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Save {inr(v.mrp - v.price)}</p>
              <Link
                to="/product/$slug"
                params={{ slug: "chromepro" }}
                className="mt-5 block rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Choose {v.label}
              </Link>
            </div>
          ))}
        </div>
      </section>


      {/* Reviews */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-3xl font-bold">What buyers say</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCT.reviews.map((r) => (
            <div key={r.title} className="surface-card p-5">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <h3 className="mt-3 text-sm font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                — {r.author}, {r.date}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
