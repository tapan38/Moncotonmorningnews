import { MAILTO_EMAIL } from "../config.js";

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date)) return dateString;
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(date);
}

function createJobCard(job) {
  const card = document.createElement("article");
  card.className = "job-item";

  const title = document.createElement("h3");
  const link = document.createElement("a");
  link.href = job.Link || "#";
  link.textContent = job.Title || "Untitled role";
  link.target = "_blank";
  link.rel = "noreferrer";
  title.appendChild(link);

  const company = document.createElement("div");
  company.textContent = job.Company || "Local team";
  company.className = "meta";

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.innerHTML = `
    <span>${job.Location || "Moncton"}</span>
    <span>${job.Category || "General"}</span>
    <span>${formatDate(job.PostedAt || new Date().toISOString())}</span>
  `;

  if (job.Featured || job["Featured?"] === true || job["Featured?"] === "TRUE") {
    const badge = document.createElement("span");
    badge.className = "category-chip";
    badge.textContent = "Featured";
    meta.appendChild(badge);
  }

  card.append(title, company, meta);
  return card;
}

export function renderJobs(container, data) {
  container.innerHTML = "";
  const section = document.createElement("section");
  section.className = "section-card";

  const header = document.createElement("div");
  header.innerHTML = `
    <p class=\"eyebrow\">Local Jobs</p>
    <h2>Open roles in Moncton</h2>
    <p class=\"notice\">No filters yet—just trusted listings with categories to scan.</p>
  `;

  const list = document.createElement("div");
  list.className = "jobs-list";

  const sorted = [...data].sort((a, b) => {
    const aDate = new Date(a.PostedAt || a.postedAt || "");
    const bDate = new Date(b.PostedAt || b.postedAt || "");
    return bDate - aDate;
  });

  if (!sorted.length) {
    const empty = document.createElement("p");
    empty.textContent = "No jobs yet—please check back soon or post yours for free.";
    list.appendChild(empty);
  }

  sorted.forEach((job) => {
    list.appendChild(createJobCard(job));
  });

  section.append(header, list);
  container.appendChild(section);

  const postJobLink = document.querySelector("[data-post-job]");
  if (postJobLink) {
    postJobLink.href = `mailto:${MAILTO_EMAIL}?subject=Post%20Job%20on%20Moncton%20Morning`;
  }
}
