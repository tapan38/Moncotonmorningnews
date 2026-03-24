function createDealCard(deal) {
  const card = document.createElement("article");
  card.className = "deal-item";

  const title = document.createElement("h3");
  title.textContent = deal.BusinessName || "Local discount";

  const description = document.createElement("p");
  description.textContent = deal.OfferText || "Discount description";

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.innerHTML = `<span>Expires: ${deal.ExpiryDate || "TBD"}</span>`;

  const link = document.createElement("a");
  link.href = deal.Link || "#";
  link.textContent = "View offer";
  link.target = "_blank";
  link.rel = "noreferrer";
  link.className = "cta";
  link.style.padding = "0.35rem 0.9rem";
  link.style.fontSize = "0.85rem";

  card.append(title, description, meta, link);
  return card;
}

export function renderDeals(container, data) {
  container.innerHTML = "";
  const section = document.createElement("section");
  section.className = "section-card";

  section.innerHTML = `
    <div>
      <p class="eyebrow">Neighborhood Deals</p>
      <h2>Discounts from local businesses</h2>
      <p class="notice">Featured offers stay at the top.</p>
    </div>
  `;

  const featuredList = document.createElement("div");
  featuredList.className = "deals-list";
  const standardList = document.createElement("div");
  standardList.className = "deals-list";

  const featured = data.filter((entry) => entry.Featured || entry.Featured === true);
  const others = data.filter((entry) => !entry.Featured);

  if (featured.length) {
    const label = document.createElement("p");
    label.className = "notice";
    label.textContent = "Featured deals";
    section.appendChild(label);
    featured.forEach((deal) => featuredList.appendChild(createDealCard(deal)));
    section.appendChild(featuredList);
  }

  if (others.length) {
    const label = document.createElement("p");
    label.className = "notice";
    label.textContent = featured.length ? "More deals" : "Latest deals";
    section.appendChild(label);
    others.forEach((deal) => standardList.appendChild(createDealCard(deal)));
    section.appendChild(standardList);
  }

  if (!data.length) {
    const empty = document.createElement("p");
    empty.textContent = "Deals will appear here once stocked.";
    section.appendChild(empty);
  }

  container.appendChild(section);
}
