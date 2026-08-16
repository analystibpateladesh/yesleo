import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="ink-panel mt-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="wordmark text-lg">YesLeo</div>
          <p className="mt-3 max-w-xs text-sm opacity-70">
            Audio hardware built in India. Mirror-chrome finishes, tuned drivers, no gimmicks.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm opacity-70">
            <li>
              <Link to="/shop">All products</Link>
            </li>
            <li>
              <Link to="/product/$slug" params={{ slug: "chromepro" }}>
                ChromePro Type-C
              </Link>
            </li>

            <li>
              <Link to="/cart">Your cart</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm opacity-70">
            <li>
              <Link to="/about">About us</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>support@YesLeo.in</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs opacity-60">
          © {new Date().getFullYear()} YesLeo. All rights reserved. Prices inclusive of all taxes.
        </div>
      </div>
    </footer>
  );
}
