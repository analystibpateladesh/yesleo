import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const customerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(8).max(20),
  address: z.string().trim().min(5).max(300),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{4,10}$/),
  notes: z.string().trim().max(500).optional().default(""),
});

const orderSchema = z.object({
  amount: z.number().int().positive().max(10_000_00),
  items: z
    .array(
      z.object({
        name: z.string().max(120),
        variantLabel: z.string().max(120),
        qty: z.number().int().positive().max(20),
        price: z.number().int().positive(),
      }),
    )
    .min(1)
    .max(20),
  customer: customerSchema,
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { logToSheet } = await import("./sheets.server");
    const keyId = process.env["RAZORPAY_KEY_ID"];
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];

    await logToSheet("Orders", {
      status: "initiated",
      paymentMethod: "razorpay",
      source: "website",
      amount: data.amount,
      items: data.items.map((i) => `${i.name} · ${i.variantLabel} x${i.qty}`).join(" | "),
      ...data.customer,
    });

    if (!keyId || !keySecret) {
      return { configured: false as const };
    }

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: data.amount * 100,
        currency: "INR",
        receipt: `wd_${Date.now()}`,
        notes: { name: data.customer.name, email: data.customer.email },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Razorpay order failed [${res.status}]: ${body}`);
      throw new Error(`Payment gateway error [${res.status}]: ${body}`);
    }

    const order = (await res.json()) as { id: string; amount: number; currency: string };
    return { configured: true as const, orderId: order.id, amount: order.amount, keyId };
  });

const verifySchema = z.object({
  razorpay_order_id: z.string().max(120),
  razorpay_payment_id: z.string().max(120),
  razorpay_signature: z.string().max(300),
  amount: z.number().int().positive(),
  items: z.string().max(2000),
  customer: customerSchema,
});

export const verifyPayment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => verifySchema.parse(data))
  .handler(async ({ data }) => {
    const { createHmac } = await import("node:crypto");
    const { logToSheet } = await import("./sheets.server");
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];
    if (!keySecret) throw new Error("Payments are not configured");

    const expected = createHmac("sha256", keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    const ok = expected === data.razorpay_signature;

    await logToSheet("Orders", {
      status: ok ? "paid" : "signature_mismatch",
      amount: data.amount,
      items: data.items,
      orderId: data.razorpay_order_id,
      paymentMethod: "razorpay",
      razorpayOrderId: data.razorpay_order_id,
      razorpayPaymentId: data.razorpay_payment_id,
      razorpaySignature: data.razorpay_signature,
      source: "website",
      ...data.customer,
    });

    if (!ok) throw new Error("Payment verification failed");
    return { success: true as const, paymentId: data.razorpay_payment_id };
  });

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(20).optional().default(""),
  message: z.string().trim().min(5).max(1000),
});

/** Record a checkout without creating a Razorpay order. */
export const testOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { logToSheet } = await import("./sheets.server");

    const result = await logToSheet("Orders", {
      status: "test",
      paymentMethod: "test",
      source: "website-test",
      amount: data.amount,
      currency: "INR",
      items: data.items.map((i) => `${i.name} · ${i.variantLabel} x${i.qty}`).join(" | "),
      ...data.customer,
    });

    if (!result.logged) {
      throw new Error(`The test order could not be saved to Google Sheets: ${result.error}`);
    }

    return { success: true as const };
  });

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { logToSheet } = await import("./sheets.server");
    const result = await logToSheet("Contacts", data);
    return { received: true as const, logged: result.logged };
  });
