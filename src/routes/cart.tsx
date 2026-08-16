import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/product";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | YesLeo" },
      {
        name: "description",
        content: "Review your ChromePro earphones order before checkout. Free shipping in India.",
      },
      { property: "og:title", content: "Your Cart | YesLeo" },
      { property: "og:description", content: "Review your order before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, total, savings } = useCart();

  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="text-3xl font-bold">Your cart</h1>

        {items.length === 0 ? (
          <div className="surface-card mt-8 p-10 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link
              to="/shop"
              className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Browse the store
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 space-y-4">
              {items.map((i) => (
                <div key={i.id} className="surface-card flex gap-4 p-4">
                  <img
                    src={i.image}
                    alt={i.name}
                    width={120}
                    height={120}
                    loading="lazy"
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold">{i.name}</h2>
                    <p className="text-sm text-muted-foreground">{i.variantLabel}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          className="px-3 py-1"
                          onClick={() => setQty(i.id, i.qty - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{i.qty}</span>
                        <button
                          className="px-3 py-1"
                          onClick={() => setQty(i.id, i.qty + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => remove(i.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{inr(i.price * i.qty)}</div>
                    <div className="text-sm text-muted-foreground line-through">
                      {inr(i.mrp * i.qty)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="surface-card mt-6 p-6">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{inr(total)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>You save</span>
                <span>{inr(savings)}</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold">
                <span>Total</span>
                <span>{inr(total)}</span>
              </div>
              <Link
                to="/checkout"
                className="mt-6 block rounded-full bg-primary px-6 py-4 text-center text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Proceed to checkout
              </Link>
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}
