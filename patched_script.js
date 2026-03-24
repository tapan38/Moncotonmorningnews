const AIRTABLE_CONFIG = {
  apiKey: "pat65JQyMHFO5yWAF.b27763a8543160b337e1c52824d379133ba49c6179499cb023f844ac87c15791",
  baseId: "appRkIddAFC3p5eqv",
  tables: {
    jobs: "Jobs",
    directory: "Directory",
    deals: "Deals",
    tips: "SideHustleTips",
    news: "News",
    events: "Events",
    submissions: "Submissions",
    subscribers: "Subscribers"
  }
};

const apiBase = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/`;
const headers = () => ({
  Authorization: `Bearer ${AIRTABLE_CONFIG.apiKey}`,
  "Content-Type": "application/json"
});

async function fetchTable(tableName) {
  try {
    const url = `${apiBase}${encodeURIComponent(tableName)}?pageSize=100`;
    const response = await fetch(url, { headers: headers() });
    if (!response.ok) {
      console.error("Airtable error", tableName, response.status, await response.text());
      return [];
    }
    const data = await response.json();
    return (data.records || []).map((record) => ({ ...record.fields, _createdTime: record.createdTime }));
  } catch (error) {
    console.error("Could not fetch", tableName, error);
    return [];
  }
}

async function postRecord(tableName, fields) {
  try {
    const url = `${apiBase}${encodeURIComponent(tableName)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ fields })
    });
    if (!response.ok) {
      console.error("Airtable POST error", tableName, response.status, await response.text());
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("POST failed", tableName, error);
    return null;
  }
}

const navButtons = document.querySelectorAll(".nav-links button[data-tab]");
const sections = document.querySelectorAll("main section");
const submitModal = document.getElementById("submit-modal");
const openSubmit = document.getElementById("open-submit");
const closeSubmit = document.getElementById("close-submit");
const submitForm = document.getElementById("submit-form");
const submitError = document.getElementById("submit-error");
const submitSuccess = document.getElementById("submit-success");
const subscribeEmail = document.getElementById("subscribe-email");
const subscribeForm = document.getElementById("subscribe-form");
const newsletterNote = document.getElementById("newsletter-note");
const makerFilter = document.getElementById("maker-filter");
const heroSubscribe = document.getElementById("hero-subscribe");

const jobList = document.querySelector("#jobs .jobs-list");
const businessGrid = document.querySelector("#makers .business-grid");
const dealsList = document.querySelector("#deals .deals-list");
const tipsList = document.querySelector("#sidehustle .tips-list");
const newsList = document.querySelector("#news .news-list");
const eventsList = document.querySelector("#events .events-list");

let directoryRecords = [];

function showSection(id) {
  sections.forEach((section) => {
    section.classList.toggle("hidden", section.id !== id);
  });
  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === id);
  });
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date)) return value;
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(date);
}

function hasFeatured(record) {
  return Boolean(record?.Featured || record?.["Featured?"]);
}

function createJobCard(job) {
  const card = document.createElement("article");
  card.className = "job-item";

  const title = document.createElement("h3");
  if (job.Link) {
    const link = document.createElement("a");
    link.href = job.Link;
    link.textContent = job.Title || "Job";
    link.target = "_blank";
    link.rel = "noreferrer";
    title.appendChild(link);
  } else {
    title.textContent = job.Title || "Job";
  }

  const meta = document.createElement("div");
  meta.className = "meta";
  if (job.Company) meta.appendChild(Object.assign(document.createElement("span"), { textContent: job.Company }));
  if (job.Location) meta.appendChild(Object.assign(document.createElement("span"), { textContent: job.Location }));
  const jobType = job.Type || job.Category;
  if (jobType) {
    const badge = document.createElement("span");
    badge.className = "category-chip";
    badge.textContent = jobType;
    meta.appendChild(badge);
  }
  const postedValue = job["Posted date"] || job.PostedAt || job.Posted;
  if (postedValue) {
    const posted = document.createElement("span");
    posted.textContent = `Posted: ${formatDate(postedValue)}`;
    meta.appendChild(posted);
  }
  if (hasFeatured(job)) {
    const badge = document.createElement("span");
    badge.className = "category-chip";
    badge.textContent = "Featured";
    meta.appendChild(badge);
  }

  const action = document.createElement("a");
  action.className = "cta";
  action.textContent = "View details";
  action.href = job.Link || "#";
  action.target = "_blank";
  action.rel = "noreferrer";
  action.style.fontSize = "0.85rem";
  action.style.padding = "0.35rem 0.9rem";

  card.append(title);
  if (meta.childElementCount) card.append(meta);
  card.append(action);
  return card;
}

function renderJobs(records) {
  jobList.innerHTML = "";
  if (!records.length) {
    jobList.textContent = "Jobs will appear here once listed.";
    return;
  }
  const sorted = [...records].sort((a, b) => {
    if (hasFeatured(a) !== hasFeatured(b)) return hasFeatured(b) ? 1 : -1;
    const aDate = new Date(a["Posted date"] || a.PostedAt || a.Posted || a._createdTime || 0).getTime();
    const bDate = new Date(b["Posted date"] || b.PostedAt || b.Posted || b._createdTime || 0).getTime();
    return bDate - aDate;
  });
  sorted.forEach((job) => jobList.appendChild(createJobCard(job)));
}

function updateDirectoryList() {
  businessGrid.innerHTML = "";
  const filter = (makerFilter.value || "all").toLowerCase();
  const filtered = directoryRecords.filter((item) => {
    const category = (item.Category || "Other").toLowerCase();
    return filter === "all" || category === filter;
  });
  if (!filtered.length) {
    businessGrid.textContent = "No businesses found for that category.";
    return;
  }
  filtered.forEach((business) => {
    const card = document.createElement("article");
    card.className = "business-item";
    card.dataset.category = business.Category || "Other";

    const title = document.createElement("h3");
    if (business.Link) {
      const link = document.createElement("a");
      link.href = business.Link;
      link.textContent = business.Name || "Local business";
      link.target = "_blank";
      link.rel = "noreferrer";
      title.appendChild(link);
    } else {
      title.textContent = business.Name || "Local business";
    }
    if (hasFeatured(business)) {
      const badge = document.createElement("span");
      badge.className = "category-chip";
      badge.textContent = "Featured";
      title.appendChild(badge);
    }

    const description = document.createElement("p");
    description.textContent = business.Description || "";

    const meta = document.createElement("div");
    meta.className = "meta";
    if (business.Category) meta.appendChild(Object.assign(document.createElement("span"), { textContent: business.Category }));
    const area = business.Area || business.Location;
    if (area) meta.appendChild(Object.assign(document.createElement("span"), { textContent: area }));

    card.append(title);
    if (description.textContent) card.append(description);
    if (meta.childElementCount) card.append(meta);
    if (business.Contact) {
      const contact = document.createElement("p");
      contact.className = "meta";
      contact.textContent = `Contact: ${business.Contact}`;
      card.append(contact);
    }
    if (business.Link) {
      const action = document.createElement("a");
      action.href = business.Link;
      action.textContent = "View / Contact";
      action.target = "_blank";
      action.rel = "noreferrer";
      action.className = "cta";
      action.style.fontSize = "0.85rem";
      action.style.padding = "0.35rem 0.9rem";
      card.append(action);
    }

    businessGrid.appendChild(card);
  });
}

function createDealCard(deal) {
  const card = document.createElement("article");
  card.className = "deal-item";

  const title = document.createElement("h3");
  title.textContent = deal.Business || deal.BusinessName || "Local deal";
  if (hasFeatured(deal)) {
    const badge = document.createElement("span");
    badge.className = "category-chip";
    badge.textContent = "Featured";
    title.appendChild(badge);
  }

  if (deal["Offer Text"] || deal.OfferText) {
    const description = document.createElement("p");
    description.textContent = deal["Offer Text"] || deal.OfferText;
    card.append(description);
  }

  const meta = document.createElement("div");
  meta.className = "meta";
  if (deal.Area) meta.appendChild(Object.assign(document.createElement("span"), { textContent: deal.Area }));
  const expiry = deal["Expiry Date"] || deal.ExpiryDate;
  if (expiry) meta.appendChild(Object.assign(document.createElement("span"), { textContent: `Valid until ${formatDate(expiry)}` }));
  if (meta.childElementCount) card.append(meta);

  if (deal.Link) {
    const action = document.createElement("a");
    action.className = "cta";
    action.textContent = "View deal";
    action.href = deal.Link;
    action.target = "_blank";
    action.rel = "noreferrer";
    action.style.fontSize = "0.85rem";
    action.style.padding = "0.35rem 0.9rem";
    card.append(action);
  }

  return card;
}

function renderDeals(records) {
  dealsList.innerHTML = "";
  if (!records.length) {
    dealsList.textContent = "Deals will appear here soon.";
    return;
  }
  const featured = records.filter((deal) => hasFeatured(deal));
  const others = records.filter((deal) => !hasFeatured(deal));
  if (featured.length) {
    const label = document.createElement("p");
    label.className = "notice";
    label.textContent = "Top deals";
    dealsList.appendChild(label);
    featured.forEach((deal) => dealsList.appendChild(createDealCard(deal)));
  }
  if (others.length) {
    const label = document.createElement("p");
    label.className = "notice";
    label.textContent = featured.length ? "More deals" : "Latest deals";
    dealsList.appendChild(label);
    others.forEach((deal) => dealsList.appendChild(createDealCard(deal)));
  }
}

function renderSideHustle(records) {
  tipsList.innerHTML = "";
  if (!records.length) {
    tipsList.textContent = "Side hustle tips are coming soon.";
    return;
  }
  records.forEach((tip) => {
    const card = document.createElement("article");
    card.className = "tip-item";
    const title = document.createElement("h3");
    title.textContent = tip.Title || "Side hustle idea";
    const description = document.createElement("p");
    description.textContent = tip.Description || "";
    const actions = document.createElement("div");
    actions.className = "meta";
    const affiliate = tip["Affiliate link"] || tip.AffiliateLink;
    if (affiliate) {
      const link = document.createElement("a");
      link.className = "cta";
      link.textContent = "Visit link";
      link.href = affiliate;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.style.fontSize = "0.85rem";
      link.style.padding = "0.35rem 0.9rem";
      actions.appendChild(link);
    }
    const guide = tip["Read Guide link"] || tip.ReadGuideLink;
    if (guide) {
      const guideLink = document.createElement("a");
      guideLink.textContent = "Learn more";
      guideLink.href = guide;
      guideLink.target = "_blank";
      guideLink.rel = "noreferrer";
      guideLink.style.fontSize = "0.8rem";
      guideLink.style.marginLeft = "0.5rem";
      actions.appendChild(guideLink);
    }
    card.append(title);
    if (description.textContent) card.append(description);
    if (actions.childElementCount) card.append(actions);
    tipsList.appendChild(card);
  });
}

function pickLatestWeek(records) {
  if (!records.length) return { week: "", rows: [] };
  const grouped = records.reduce((acc, row) => {
    const key = row.WeekLabel || "Current Week";
    acc[key] = acc[key] || [];
    acc[key].push(row);
    return acc;
  }, {});
  const weeks = Object.entries(grouped).map(([week, rows]) => {
    const newest = Math.max(...rows.map((r) => new Date(r._createdTime || r.CreatedAt || r["Created At"] || 0).getTime()));
    return { week, rows, newest };
  });
  weeks.sort((a, b) => b.newest - a.newest);
  return { week: weeks[0].week, rows: weeks[0].rows };
}

function renderNews(records) {
  newsList.innerHTML = "";
  if (!records.length) {
    newsList.textContent = "Newsletter news will appear here.";
    return;
  }
  const { week, rows } = pickLatestWeek(records);
  const card = document.createElement("article");
  card.className = "job-item";
  const label = document.createElement("p");
  label.className = "notice";
  label.textContent = "Newsletter News";
  const heading = document.createElement("h3");
  heading.textContent = week || "Latest";
  const list = document.createElement("ul");
  list.style.paddingLeft = "1.1rem";
  rows.slice(0, 3).forEach((item) => {
    if (!item.Headline && !item.SourceLink) return;
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = item.SourceLink || "#";
    link.textContent = item.Headline || "News";
    link.target = "_blank";
    link.rel = "noreferrer";
    li.appendChild(link);
    list.appendChild(li);
  });
  card.append(label, heading, list);
  newsList.appendChild(card);
}

function renderEvents(records) {
  eventsList.innerHTML = "";
  if (!records.length) {
    eventsList.textContent = "Upcoming newsletter events will appear here.";
    return;
  }
  const { week, rows } = pickLatestWeek(records);
  const card = document.createElement("article");
  card.className = "job-item";
  const label = document.createElement("p");
  label.className = "notice";
  label.textContent = "Newsletter Events";
  const heading = document.createElement("h3");
  heading.textContent = week || "Latest";
  const list = document.createElement("ul");
  list.style.paddingLeft = "1.1rem";
  rows.slice(0, 3).forEach((item) => {
    if (!item.Title && !item.SourceLink) return;
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = item.SourceLink || "#";
    link.textContent = item.Title || "Event";
    link.target = "_blank";
    link.rel = "noreferrer";
    li.appendChild(link);
    list.appendChild(li);
  });
  card.append(label, heading, list);
  eventsList.appendChild(card);
}

function renderDirectory(records) {
  directoryRecords = [...records].sort((a, b) => (hasFeatured(b) ? 1 : 0) - (hasFeatured(a) ? 1 : 0));
  updateDirectoryList();
}

async function loadAirtableData() {
  const [jobs, directory, deals, tips, news, events] = await Promise.all([
    fetchTable(AIRTABLE_CONFIG.tables.jobs),
    fetchTable(AIRTABLE_CONFIG.tables.directory),
    fetchTable(AIRTABLE_CONFIG.tables.deals),
    fetchTable(AIRTABLE_CONFIG.tables.tips),
    fetchTable(AIRTABLE_CONFIG.tables.news),
    fetchTable(AIRTABLE_CONFIG.tables.events)
  ]);

  renderJobs(jobs);
  renderDirectory(directory);
  renderDeals(deals);
  renderSideHustle(tips);
  renderNews(news);
  renderEvents(events);
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showSection(button.dataset.tab);
  });
});

openSubmit.addEventListener("click", () => {
  submitModal.classList.add("open");
  submitSuccess.textContent = "";
  submitError.textContent = "";
});

closeSubmit.addEventListener("click", () => {
  submitModal.classList.remove("open");
});

submitModal.addEventListener("click", (event) => {
  if (event.target === submitModal) {
    submitModal.classList.remove("open");
  }
});

submitForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitError.textContent = "";
  submitSuccess.textContent = "";
  const formData = new FormData(submitForm);
  const email = (formData.get("email") || "").toString().trim();
  const phone = (formData.get("phone") || "").toString().trim();
  const listingType = formData.get("listing-type") || "";
  const details = (formData.get("details") || "").toString().trim();
  const isValid = /\S+@\S+\.\S+/.test(email);
  if (!isValid) {
    submitError.textContent = "Please enter a valid email.";
    return;
  }
  const payload = {
    "Listing type": listingType,
    "Contact email": email,
    Phone: phone || undefined,
    "Listing details": details
  };
  const result = await postRecord(AIRTABLE_CONFIG.tables.submissions, payload);
  if (result) {
    submitSuccess.textContent = "Thanks! Your listing request has been received. I'll review and contact you if needed.";
    submitForm.reset();
  } else {
    submitError.textContent = "Something went wrong. Please try again.";
  }
});

subscribeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  newsletterNote.textContent = "";
  const email = (subscribeEmail.value || "").trim();
  const isValid = /\S+@\S+\.\S+/.test(email);
  if (!isValid) {
    newsletterNote.textContent = "Please enter a valid email.";
    return;
  }
  const result = await postRecord(AIRTABLE_CONFIG.tables.subscribers, { Email: email });
  if (result) {
    newsletterNote.textContent = "Thanks! You're on the list.";
    subscribeEmail.value = "";
  } else {
    newsletterNote.textContent = "Something went wrong. Please try again later.";
  }
});

makerFilter.addEventListener("change", () => {
  updateDirectoryList();
});

heroSubscribe?.addEventListener("click", () => {
  document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" });
});

function getInitialTab() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("tab");
  return requested && document.getElementById(requested) ? requested : "jobs";
}

function handleInitialTab() {
  const tab = getInitialTab();
  showSection(tab);
  if (tab === "news" || tab === "events") {
    document.getElementById(tab)?.scrollIntoView({ behavior: "smooth" });
  }
}

window.addEventListener("popstate", handleInitialTab);

handleInitialTab();
loadAirtableData();
