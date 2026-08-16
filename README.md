# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Payments & Google Sheets (Order Recording)

To enable Razorpay payments and record orders to Google Sheets, set the following environment variables in your deployment or local `.env` file (see `.env.example`):

- `RAZORPAY_KEY_ID` — your Razorpay key id (test or live)
- `RAZORPAY_KEY_SECRET` — your Razorpay key secret
- `GOOGLE_SHEETS_WEBHOOK_URL` — a deployed Google Apps Script Web App URL that appends rows to a sheet

The server checkout functions live in [src/lib/checkout.functions.ts](src/lib/checkout.functions.ts) and already read these environment variables. When an order is created it will call the Google Sheets webhook to append an "initiated" row, and on payment verification it will append a "paid" row.

There is a sample Google Apps Script you can deploy as a Web App at [docs/google-sheets-webhook.gs](docs/google-sheets-webhook.gs).

Contact details shown on the Contact page are hard-coded in [src/routes/contact.tsx](src/routes/contact.tsx). Edit that file to update the support email, phone or address displayed on the site.
