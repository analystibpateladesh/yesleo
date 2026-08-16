import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { PRODUCT } from "@/lib/product";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About YesLeo | Chrome Audio Hardware" },
      {
        name: "description",
        content:
          "YesLeo builds mirror-chrome wired earphones in India — hand-tuned drivers, honest pricing and no wireless gimmicks.",
      },
      { property: "og:title", content: "About YesLeo" },
      {
        property: "og:description",
        content: "Mirror-chrome wired audio, engineered and tuned in India.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">About</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">We make wires cool again.</h1>
        <div className="mt-8 space-y-5 text-muted-foreground">
          <p>
            YesLeo started in a small workshop with one stubborn belief: a wired earphone, done
            properly, still beats most of what you can pair over Bluetooth. No charging. No
            dropouts. No latency between a tap and a sound.
          </p>
          <p>
            Every ChromePro shell is electroplated to a true mirror finish, then matched to a
            14.2mm dynamic driver that we tuned across more than 200 listening passes — bass you can
            feel, vocals that stay clean.
          </p>
          <p>
            We sell direct, we price honestly, and we back every pair with a 7-day return window
            and real human support.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            ["200+", "tuning passes per driver"],
            ["84", "verified reviews at 4.3/5"],
            ["7-day", "no-questions returns"],
          ].map(([big, small]) => (
            <div key={big} className="surface-card p-6">
              <div className="text-2xl font-bold">{big}</div>
              <div className="mt-1 text-sm text-muted-foreground">{small}</div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <img
            src={PRODUCT.images[3]!}
            alt="ChromePro earphones on a dark surface"
            width={1600}
            height={1008}
            loading="lazy"
            className="w-full rounded-xl object-cover"
          />
        </div>

        <div className="mt-10 flex gap-3">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Shop ChromePro
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-muted"
          >
            Talk to us
          </Link>
        </div>
      </section>
    </Layout>
  );
}
