import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Check, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/site/Layout";
import { PRODUCT, inr } from "@/lib/product";
import { useCart } from "@/lib/cart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/product/$slug")({
  head: () => ({
    meta: [
      { title: "ChromePro Earphones (Type-C) - ₹599 | YesLeo" },
      {
        name: "description",
        content:
          "ChromePro Type-C wired earphones: 14.2mm hand-tuned driver, mirror-chrome shell, IPX5, zero latency. ₹599 with free shipping and 7-day returns.",
      },
      { property: "og:title", content: "ChromePro Earphones (Type-C) - ₹599" },
      {
        property: "og:description",
        content: "Mirror-finish sound. Molded to move. 14.2mm driver, Type-C, zero latency.",
      },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const navigate = useNavigate();
  const { add } = useCart();
  const [image, setImage] = useState(0);
  const [variantId, setVariantId] = useState(PRODUCT.variants[0]!.id);
  const variant = PRODUCT.variants.find((v) => v.id === variantId)!;

  const addToCart = () => {
    add({
      id: `${PRODUCT.slug}-${variant.id}`,
      name: PRODUCT.name,
      variantLabel: variant.label,
      qty: 1,
      units: variant.qty,
      price: variant.price,
      mrp: variant.mrp,
      image: PRODUCT.images[0]!,
    });
  };

  return (
    <Layout>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl bg-muted">
            <img
              src={PRODUCT.images[image]!}
              alt={`${PRODUCT.name} view ${image + 1}`}
              width={1200}
              height={1200}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {PRODUCT.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setImage(i)}
                className={`overflow-hidden rounded-xl border-2 transition-colors ${
                  i === image ? "border-foreground" : "border-transparent"
                }`}
                aria-label={`Show image ${i + 1}`}
              >
                <img
                  src={src}
                  alt=""
                  width={300}
                  height={300}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="wordmark text-xs text-muted-foreground">{PRODUCT.brand}</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">{PRODUCT.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{PRODUCT.tagline}</p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex text-foreground">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </span>
            <span className="text-muted-foreground">
              {PRODUCT.rating}/5 · {PRODUCT.reviewCount} reviews
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-bold">{inr(variant.price)}</span>
            <span className="text-lg text-muted-foreground line-through">{inr(variant.mrp)}</span>
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              {Math.round((1 - variant.price / variant.mrp) * 100)}% OFF
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Inclusive of all taxes · Free shipping
          </p>

          <p className="mt-8 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Select pack type
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {PRODUCT.variants.map((v) => {
              const active = v.id === variantId;
              return (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    active ? "border-foreground bg-muted" : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{v.label}</span>
                    {active && <Check className="h-4 w-4" />}
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-bold">{inr(v.price)}</span>
                    <span className="text-sm text-muted-foreground line-through">{inr(v.mrp)}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Save {inr(v.mrp - v.price)}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => {
                addToCart();
                navigate({ to: "/checkout" });
              }}
              className="rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Buy Now
            </button>
            <button
              onClick={() => {
                addToCart();
                toast.success("Added to cart");
              }}
              className="rounded-full border border-border px-6 py-4 text-sm font-semibold hover:bg-muted"
            >
              Add to Cart
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
            {[
              [Truck, "Free shipping"],
              [ShieldCheck, "Premium support"],
              [RotateCcw, "7-day returns"],
            ].map(([Icon, label], i) => {
              const I = Icon as typeof Truck;
              return (
                <div key={i} className="rounded-xl border border-border px-2 py-4">
                  <I className="mx-auto h-4 w-4" />
                  <div className="mt-2 text-muted-foreground">{label as string}</div>
                </div>
              );
            })}
          </div>

          <Accordion type="single" collapsible className="mt-8" defaultValue="desc">
            <AccordionItem value="desc">
              <AccordionTrigger>Product Description</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{PRODUCT.description}</p>
                <ul className="mt-4 space-y-2">
                  {PRODUCT.highlights.map((h) => (
                    <li key={h} className="flex gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="specs">
              <AccordionTrigger>Specifications</AccordionTrigger>
              <AccordionContent>
                <dl className="divide-y divide-border">
                  {PRODUCT.specs.map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 text-sm">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger>7-Day Returns &amp; Refund Policy</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Raise a return within 7 days of delivery for any manufacturing defect or damage in
                  transit. Keep the original box and accessories. Once the pickup is complete,
                  refunds are processed to the original payment method within 5–7 working days.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="reviews">
              <AccordionTrigger>Customer Reviews ({PRODUCT.reviewCount})</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-5">
                  {PRODUCT.reviews.map((r) => (
                    <div key={r.title} className="border-b border-border pb-4 last:border-0">
                      <div className="flex text-foreground">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <h4 className="mt-2 font-semibold">{r.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        — {r.author}, {r.date}
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </Layout>
  );
}
