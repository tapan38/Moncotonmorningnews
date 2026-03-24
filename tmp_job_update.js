const fs = require('fs');
const path = 'index.html';
let text = fs.readFileSync(path, 'utf8');
const start = text.indexOf('function createJobCard');
const end = text.indexOf('function renderJobs');
if (start === -1 || end === -1) throw new Error('block not found');
const newBlock = `function createJobCard(job) {
  const card = document.createElement("article");
  card.className = "job-item";

  const title = document.createElement("h3");
  title.style.display = "flex";
  title.style.alignItems = "center";
  title.style.justifyContent = "space-between";
  title.style.gap = "0.5rem";

  const titleText = document.createElement("span");
  if (job.Link) {
    const link = document.createElement("a");
    link.href = job.Link;
    link.textContent = job.Title || "Job";
    link.target = "_blank";
    link.rel = "noreferrer";
    titleText.appendChild(link);
  } else {
    titleText.textContent = job.Title || "Job";
  }

  const badgeWrapper = document.createElement("span");
  badgeWrapper.style.marginLeft = "auto";
  if (hasFeatured(job)) {
    const badge = document.createElement("span");
    badge.className = "category-chip";
    badge.textContent = "Featured";
    badgeWrapper.appendChild(badge);
  }

  title.appendChild(titleText);
  if (badgeWrapper.children.length) {
    title.appendChild(badgeWrapper);
  }

  const meta = document.createElement("div");
  meta.className = "meta";
  if (job.Company) meta.appendChild(Object.assign(document.createElement("span"), { textContent: job.Company }));
  if (job.Location) meta.appendChild(Object.assign(document.createElement("span"), { textContent: job.Location }));
  const jobType = job.Type || job.Category;
  if (jobType) {
    meta.appendChild(Object.assign(document.createElement("span"), { textContent: jobType }));
  }
  const postedValue = job["Posted date"] || job.PostedAt || job.Posted;
  if (postedValue) {
    const posted = document.createElement("span");
    posted.textContent = `Posted: ${formatDate(postedValue)}`;
    meta.appendChild(posted);
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

`;
text = text.slice(0, start) + newBlock + text.slice(end);
fs.writeFileSync(path, text);
