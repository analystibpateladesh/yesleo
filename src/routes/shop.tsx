import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PRODUCT, inr } from "@/lib/product";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Chrome Wired Earphones | YesLeo" },
      {
        name: "description",
        content:
          "Buy ChromePro Type-C wired earphones — 14.2mm driver, mirror-chrome shell, zero latency. ₹599 with free shipping across India.",
      },
      { property: "og:title", content: "Shop Chrome Wired Earphones | YesLeo" },
      {
        property: "og:description",
        content: "ChromePro Type-C wired earphones at ₹599. Free shipping, 7-day returns.",
      },
    ],
  }),
  component: ShopPage,
});

const products = [
  {
    slug: "chromepro",
    name: PRODUCT.name,
    tagline: PRODUCT.tagline,
    price: PRODUCT.price,
    mrp: PRODUCT.mrp,
    image: PRODUCT.images[0]!,
    inStock: true,
  },
];

function ShopPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 pb-4 pt-14">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Store</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Wired. Chromed. Ready.</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          One product line, obsessively tuned. Everything ships free across India with 7-day
          returns.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <article key={i} className="surface-card group overflow-hidden">
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img
                src={p.image}
                alt={p.name}
                width={1200}
                height={1200}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {!p.inStock && (
                <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">
                  Sold out
                </span>
              )}
            </div>
            <div className="space-y-2 p-5">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="text-sm text-muted-foreground">{p.tagline}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-current" /> {PRODUCT.rating}/5 ·{" "}
                {PRODUCT.reviewCount} reviews
              </div>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-xl font-bold">{inr(p.price)}</span>
                <span className="text-sm text-muted-foreground line-through">{inr(p.mrp)}</span>
              </div>
              {p.inStock ? (
                <Link
                  to="/product/$slug"
                  params={{ slug: p.slug }}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  View product
                </Link>
              ) : (
                <span className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground">
                  Notify me
                </span>
              )}
            </div>
          </article>
        ))}
      </section>
    </Layout>
  );
}
