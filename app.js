import { AIRTABLE_CONFIG, SUBSCRIPTION_ENDPOINT } from "./config.js";
import { fetchTable } from "./data/airtableService.js";
import { renderJobs } from "./sections/jobs.js";
import { renderDirectory } from "./sections/directory.js";
import { renderDeals } from "./sections/deals.js";
import { renderSideHustle } from "./sections/sideHustle.js";
import { renderNews } from "./sections/news.js";
import { renderEvents } from "./sections/events.js";

const content = document.getElementById("content");
const nav = document.getElementById("main-nav");
const newsletterForm = document.getElementById("newsletter-form");
const newsletterNote = document.querySelector(".newsletter-note");

const SECTION_DEF = {
  jobs: { title: "Jobs", render: renderJobs, tableKey: "jobs" },
  directory: { title: "Makers & Services", render: renderDirectory, tableKey: "directory" },
  deals: { title: "Deals", render: renderDeals, tableKey: "deals" },
  sideHustle: { title: "Side Hustle", render: renderSideHustle, tableKey: "tips" },
  news: { title: "News", render: renderNews, tableKey: "news" },
  events: { title: "Events", render: renderEvents, tableKey: "events" }
};

const STANDARD_TABS = ["jobs", "directory", "deals", "sideHustle"];

function getActiveTabFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");
  if (tab && SECTION_DEF[tab]) {
    return tab;
  }
  return "jobs";
}

function updateNav(activeTab) {
  nav.innerHTML = "";
  const tabsToShow = ["news", "events"].includes(activeTab) ? [activeTab] : STANDARD_TABS;

  tabsToShow.forEach((tabKey) => {
    const button = document.createElement("button");
    button.textContent = SECTION_DEF[tabKey].title;
    button.className = activeTab === tabKey ? "active" : "";
    button.addEventListener("click", () => {
      if (tabKey === activeTab) return;
      replaceTabInUrl(tabKey);
      renderActiveSection(tabKey);
    });
    nav.appendChild(button);
  });
}

function replaceTabInUrl(tab) {
  const params = new URLSearchParams(window.location.search);
  if (tab === "jobs") {
    params.delete("tab");
  } else {
    params.set("tab", tab);
  }
  const search = params.toString();
  const newUrl = search ? `${window.location.pathname}?${search}` : window.location.pathname;
  window.history.pushState({ tab }, "", newUrl);
}

async function renderActiveSection(overrideTab) {
  const activeTab = overrideTab || getActiveTabFromUrl();
  updateNav(activeTab);
  content.innerHTML = "";
  const loading = document.createElement("p");
  loading.textContent = "Loading content...";
  content.appendChild(loading);

  const section = SECTION_DEF[activeTab];
  if (!section) {
    content.innerHTML = "<p>Section not found.</p>";
    return;
  }

  const data = await fetchTable(AIRTABLE_CONFIG.tables[section.tableKey]);
  content.innerHTML = "";
  section.render(content, data);
}

newsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(newsletterForm);
  const email = (formData.get("email") || "").toString().trim();

  if (!validateEmail(email)) {
    newsletterNote.textContent = "Please enter a valid email.";
    return;
  }

  handleSubscription(email);
  newsletterNote.textContent = "Thanks! You are on the list.";
  newsletterForm.reset();
});

function validateEmail(value) {
  return /\S+@\S+\.\S+/.test(value);
}

function handleSubscription(email) {
  console.log("TODO: connect to", SUBSCRIPTION_ENDPOINT || "your endpoint", email);
  // TODO: replace this console log with a fetch to your Airtable form or webhook.
}

window.addEventListener("popstate", () => {
  renderActiveSection();
});

document.querySelector("[data-scroll-to]")?.addEventListener("click", (event) => {
  event.preventDefault();
  const target = document.getElementById("newsletter");
  target?.scrollIntoView({ behavior: "smooth" });
});

renderActiveSection();
