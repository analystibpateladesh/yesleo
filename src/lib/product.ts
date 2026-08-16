import img1 from "@/assets/chromepro-1.jpg";
import img2 from "@/assets/chromepro-2.jpg";
import img3 from "@/assets/chromepro-3.jpg";
import img4 from "@/assets/3.png";

export const IMAGES = [img1, img2, img3, img4];

export type Variant = {
  id: string;
  label: string;
  sub: string;
  qty: number;
  price: number;
  mrp: number;
};

export const PRODUCT = {
  slug: "chromepro-earphones-type-c",
  brand: "YesLeo",
  name: "ChromePro Earphones (Type-C)",
  tagline: "Mirror-finish sound. Molded to move.",
  rating: 4.3,
  reviewCount: 84,
  price: 599,
  mrp: 1299,
  images: IMAGES,
  highlights: [
    "14.2mm dynamic driver, hand-tuned across 200+ passes",
    "Type-C wired — direct plug, zero latency, zero charging",
    "106±3dB sensitivity · ≤0.5% distortion · 20Hz–20kHz",
    "Electroplated mirror-chrome shell on a 1m TPE cable",
  ],
  description:
    "ChromePro is our flagship Type-C wired earphone — an electroplated mirror-chrome shell wrapped around a 14.2mm dynamic driver, hand-tuned across 200+ passes for deep bass and clear vocals. Plugs straight into any Type-C device: no pairing, no charging, zero latency. IPX5 sweat & splash resistant, built on a durable TPE cable that's made to move with you.",
  specs: [
    ["Driver", "14.2mm dynamic"],
    ["Connector", "Type-C, wired"],
    ["Cable Length", "1m"],
    ["Frequency Response", "20Hz – 20kHz"],
    ["Sensitivity", "106±3dB"],
    ["Impedance", "32Ω"],
    ["Distortion", "≤0.5%"],
    ["Weight", "50g"],
    ["Color", "Chrome"],
    ["Model", "WD-CPRO-TC"],
  ] as [string, string][],
  variants: [
    { id: "pack-1", label: "Buy 1", sub: "Single pack", qty: 1, price: 599, mrp: 1299 },
    { id: "pack-2", label: "Buy 2 — Save more", sub: "Best value", qty: 2, price: 1099, mrp: 2598 },
  ] as Variant[],
  reviews: [
    {
      title: "Better than my AirPods.",
      body: "The chrome finish looks unreal, and the bass is punchy without muddying vocals. Call quality on the metro is genuinely impressive.",
      author: "Karan",
      date: "12 Jun 2026",
    },
    {
      title: "Insane value at this price.",
      body: "Lasts my entire work day and gym sessions. Fit is snug and it actually works for BGMI.",
      author: "Aakash",
      date: "04 Jun 2026",
    },
    {
      title: "Loving the design.",
      body: "Only wish they had ANC. Otherwise a 10/10 buy, especially with the Buy 2 combo.",
      author: "Megha",
      date: "28 May 2026",
    },
    {
      title: "Gift-worthy packaging.",
      body: "Unboxing felt like a premium product. Sound is crisp, mids are warm. Highly recommend.",
      author: "Iyaapan",
      date: "19 May 2026",
    },
  ],
};

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
