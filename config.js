export const AIRTABLE_CONFIG = {
  apiKey: "", // TODO: add your Airtable API key (or leave empty to use embed/fallback data)
  baseId: "", // TODO: add your Airtable Base ID (like appXXXXXXXXX)
  tables: {
    jobs: "Local Jobs",
    directory: "Moncton Makers & Services",
    deals: "Neighborhood Discounts",
    tips: "SideHustleTips",
    news: "News",
    events: "Events"
  },
  // Optionally swap to embed views instead of REST API by providing base/embed URLs here.
  embedUrls: {
    jobs: "",
    directory: "",
    deals: "",
    tips: "",
    news: "",
    events: ""
  }
};

export const MAILTO_EMAIL = "hello@monctonmorning.ca"; // TODO: replace with the email used for "Post Job for Free"
export const SUBSCRIPTION_ENDPOINT = ""; // TODO: point this at your subscription webhook or Airtable endpoint later

export const FILTER_CATEGORIES = [
  "All",
  "Food",
  "Services",
  "Retail",
  "Home-based",
  "Other"
];
