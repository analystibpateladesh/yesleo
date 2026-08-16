import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "@/components/site/Layout";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/product";
import { createOrder, testOrder, verifyPayment } from "@/lib/checkout.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout | YesLeo" },
      {
        name: "description",
        content:
          "Enter your delivery details and pay securely via Razorpay — UPI, cards, net banking and wallets.",
      },
      { property: "og:title", content: "Secure Checkout | YesLeo" },
      { property: "og:description", content: "Pay securely via Razorpay." },
    ],
  }),
  component: CheckoutPage,
});

type RazorpayCtor = new (options: Record<string, unknown>) => {
  open: () => void;
};

function loadRazorpay(): Promise<RazorpayCtor | null> {
  return new Promise((resolve) => {
    const w = window as unknown as { Razorpay?: RazorpayCtor };

    if (w.Razorpay) return resolve(w.Razorpay);

    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(w.Razorpay ?? null);
    s.onerror = () => resolve(null);

    document.body.appendChild(s);
  });
}

const empty = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
};

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, savings, clear } = useCart();

  const startOrder = useServerFn(createOrder);
  const saveTestOrder = useServerFn(testOrder);
  const verify = useServerFn(verifyPayment);

  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  const set =
    (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const itemsSummary = items.map((i) => `${i.name} · ${i.variantLabel} x${i.qty}`).join(" | ");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) return;

    setBusy(true);

    try {
      const order = await startOrder({
        data: {
          amount: total,
          items: items.map((i) => ({
            name: i.name,
            variantLabel: i.variantLabel,
            qty: i.qty,
            price: i.price,
          })),
          customer: form,
        },
      });

      if (!order.configured) {
        toast.error(
          "Payments aren't configured yet. Your details were saved — add the Razorpay keys to go live.",
        );
        return;
      }

      const Razorpay = await loadRazorpay();

      if (!Razorpay) {
        toast.error("Could not load the payment window. Check your connection and retry.");
        return;
      }

      const rzp = new Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: "INR",
        name: "YesLeo",
        description: "ChromePro Earphones order",
        order_id: order.orderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#111111",
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verify({
              data: {
                ...response,
                amount: total,
                items: itemsSummary,
                customer: form,
              },
            });

            clear();
            toast.success("Payment successful! Your order is confirmed.");
            navigate({ to: "/" });
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Payment verification failed.");
          }
        },
      });

      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const onTestCheckout = async () => {
    if (items.length === 0) return;

    setBusy(true);

    try {
      await saveTestOrder({
        data: {
          amount: total,
          items: items.map((i) => ({
            name: i.name,
            variantLabel: i.variantLabel,
            qty: i.qty,
            price: i.price,
          })),
          customer: form,
        },
      });

      clear();
      toast.success("Test order recorded successfully.");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not record test order.");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-foreground";

  return (
    <Layout>
      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-14 md:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Delivery details, then secure payment via Razorpay (UPI, cards, net banking, wallets).
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className={field}
                placeholder="Full name"
                required
                maxLength={80}
                value={form.name}
                onChange={set("name")}
              />

              <input
                className={field}
                type="email"
                placeholder="Email"
                required
                maxLength={160}
                value={form.email}
                onChange={set("email")}
              />
            </div>

            <input
              className={field}
              placeholder="Phone number"
              required
              maxLength={20}
              value={form.phone}
              onChange={set("phone")}
            />

            <textarea
              className={`${field} min-h-24`}
              placeholder="Full address"
              required
              maxLength={300}
              value={form.address}
              onChange={set("address")}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <input
                className={field}
                placeholder="City"
                required
                maxLength={80}
                value={form.city}
                onChange={set("city")}
              />

              <input
                className={field}
                placeholder="State"
                required
                maxLength={80}
                value={form.state}
                onChange={set("state")}
              />

              <input
                className={field}
                placeholder="PIN code"
                required
                pattern="\d{4,10}"
                value={form.pincode}
                onChange={set("pincode")}
              />
            </div>

            <textarea
              className={field}
              placeholder="Order notes (optional)"
              maxLength={500}
              value={form.notes}
              onChange={set("notes")}
            />

            <button
              type="submit"
              disabled={busy || items.length === 0}
              className="w-full rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Processing…" : `Pay ${inr(total)} securely`}
            </button>

            <button
              type="button"
              disabled={busy || items.length === 0}
              onClick={onTestCheckout}
              className="w-full text-center text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-60"
            >
              Test checkout — bypass Razorpay
            </button>
          </form>
        </div>

        <aside className="surface-card h-fit p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>

          {items.length === 0 ? (
            <div className="mt-4 text-sm text-muted-foreground">
              Your cart is empty.{" "}
              <Link to="/shop" className="underline">
                Go to the store
              </Link>
              .
            </div>
          ) : (
            <>
              <div className="mt-4 space-y-4">
                {items.map((i) => (
                  <div key={i.id} className="flex gap-3">
                    <img
                      src={i.image}
                      alt={i.name}
                      width={64}
                      height={64}
                      loading="lazy"
                      className="h-16 w-16 rounded-lg object-cover"
                    />

                    <div className="flex-1 text-sm">
                      <div className="font-medium">{i.name}</div>

                      <div className="text-muted-foreground">
                        {i.variantLabel} × {i.qty}
                      </div>
                    </div>

                    <div className="text-sm font-semibold">{inr(i.price * i.qty)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="flex justify-between">
                  <span>You save</span>
                  <span>{inr(savings)}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold">
                <span>Total</span>
                <span>{inr(total)}</span>
              </div>
            </>
          )}
        </aside>
      </section>
    </Layout>
  );
}
