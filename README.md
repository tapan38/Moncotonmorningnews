# Moncton Morning

A lightweight static hub for Moncton-focused jobs, makers, deals, side hustles, and newsletter-only news/events.

## Key features
- Client-side navigation with default **Jobs** view and dedicated **newsletter** views (`?tab=news` and `?tab=events`).
- Airtable-powered data access abstracted in `scripts/data/airtableService.js`, with clear placeholders for API key/base/table names.
- Directory filter and featured deals layout, plus a placeholder newsletter signup handler.
- Modular sections so you can swap data sources or embed Airtable views later.

## Setup
1. **Add Airtable credentials** (optional if you rely on mock data):
   - Open `scripts/config.js` and fill in `AIRTABLE_CONFIG.apiKey` and `AIRTABLE_CONFIG.baseId` (keep these private).
   - Confirm the table names match the ones in your Airtable base.
   - Optionally paste embed view URLs into `AIRTABLE_CONFIG.embedUrls` if you prefer iframes instead of the REST API.
2. **Set your contact info**:
   - Update `MAILTO_EMAIL` in `scripts/config.js` for the `Post Job for Free` action.
   - Update `SUBSCRIPTION_ENDPOINT` with the webhook or Airtable form endpoint that will collect newsletter emails.
3. **Serve the site** (no build tools needed):
   - From this folder run `npx serve .` or `python -m http.server 4173`.
   - Open `http://localhost:4173` (or the port you choose) to see the page.

## Navigation and data
- Default tab (`Jobs`) loads first. Use the nav to load Directory, Deals, or Side Hustle sections without reloading the page.
- Access newsletter-only content by linking to `?tab=news` or `?tab=events`; those URLs hide the other sections automatically.

## Newsletter signup
The form validates emails and calls `handleSubscription` in `scripts/app.js`. Replace the placeholder logic with a `fetch` to your Airtable form or webhook once ready.

## Airtable token
Let me know when you need help generating or storing your Airtable token securely—I can guide the next steps.
