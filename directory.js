import { FILTER_CATEGORIES } from "../config.js";

function createBusinessCard(business) {
  const card = document.createElement("article");
  card.className = "business-item";

  const title = document.createElement("h3");
  const link = document.createElement("a");
  link.href = business.Link || "#";
  link.textContent = business.Name || "Moncton Maker";
  link.target = "_blank";
  link.rel = "noreferrer";
  title.appendChild(link);

  const description = document.createElement("p");
  description.textContent = business.Description || "Local shop or service.";

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.innerHTML = `<span>${business.Category || "Community"}</span><span>${business.Contact || "Contact soon"}</span>`;

  card.append(title, description, meta);
  return card;
}

export function renderDirectory(container, data) {
  container.innerHTML = "";
  const section = document.createElement("section");
  section.className = "section-card";

  section.innerHTML = `
    <div>
      <p class="eyebrow">Moncton Makers & Services</p>
      <h2>Local businesses you can call today</h2>
    </div>
  `;

  const filterRow = document.createElement("div");
  filterRow.className = "filter-controls";

  const select = document.createElement("select");
  FILTER_CATEGORIES.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  filterRow.append(select);
  section.appendChild(filterRow);

  const list = document.createElement("div");
  list.className = "business-grid";

  function updateList() {
    list.innerHTML = "";
    const selected = select.value;
    const filtered = data.filter((item) => {
      const category = (item.Category || "Other").toLowerCase();
      return selected === "All" || category === selected.toLowerCase();
    });

    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.textContent = "No businesses found for that category yet.";
      list.appendChild(empty);
      return;
    }

    filtered.forEach((business) => {
      list.appendChild(createBusinessCard(business));
    });
  }

  select.addEventListener("change", updateList);
  updateList();
  section.appendChild(list);
  container.appendChild(section);
}
