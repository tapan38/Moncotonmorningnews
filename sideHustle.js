function createTipCard(tip) {
  const card = document.createElement("article");
  card.className = "tip-item";

  const title = document.createElement("h3");
  title.textContent = tip.Title || "Side hustle idea";

  const description = document.createElement("p");
  description.textContent = tip.Description || "Short idea description";

  const actions = document.createElement("div");
  actions.className = "meta";

  const link = document.createElement("a");
  link.href = tip.AffiliateLink || "#";
  link.textContent = "Learn more";
  link.target = "_blank";
  link.rel = "noreferrer";
  link.className = "cta";
  link.style.padding = "0.35rem 0.8rem";
  link.style.fontSize = "0.85rem";

  actions.appendChild(link);
  card.append(title, description, actions);
  return card;
}

export function renderSideHustle(container, data) {
  container.innerHTML = "";
  const section = document.createElement("section");
  section.className = "section-card";

  section.innerHTML = `
    <div>
      <p class="eyebrow">Side Hustle Tips</p>
      <h2>Quick ideas to earn extra cash</h2>
    </div>
  `;

  const list = document.createElement("div");
  list.className = "tips-list";

  data.forEach((tip) => {
    list.appendChild(createTipCard(tip));
  });

  if (!data.length) {
    const empty = document.createElement("p");
    empty.textContent = "Tips appearing soon—stay tuned.";
    list.appendChild(empty);
  }

  section.appendChild(list);
  container.appendChild(section);
}
