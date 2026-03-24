function createNewsCard(news) {
  const card = document.createElement("article");
  card.className = "news-item";

  const headline = document.createElement("h3");
  const link = document.createElement("a");
  link.href = news.SourceLink || "#";
  link.textContent = news.Headline || "Newsletter news";
  link.target = "_blank";
  link.rel = "noreferrer";
  headline.appendChild(link);

  const meta = document.createElement("div");
  meta.className = "meta";
  const dateText = news.CreatedAt ? new Date(news.CreatedAt).toLocaleDateString("en-CA", {dateStyle: "medium"}) : "";
  meta.innerHTML = `<span>${news.WeekLabel || "Weekly"}</span><span>${dateText}</span>`;

  card.append(headline, meta);
  return card;
}

export function renderNews(container, data) {
  container.innerHTML = "";
  const section = document.createElement("section");
  section.className = "section-card";

  section.innerHTML = `
    <div>
      <p class="eyebrow">Newsletter Exclusive</p>
      <h2>News for the week</h2>
      <p class="notice">Only accessible via ?tab=news</p>
    </div>
  `;

  const weekSelect = document.createElement("select");
  const weeks = Array.from(new Set(data.map((item) => item.WeekLabel || "Current Week")));

  weeks.forEach((weekLabel) => {
    const option = document.createElement("option");
    option.value = weekLabel;
    option.textContent = weekLabel;
    weekSelect.appendChild(option);
  });

  const controls = document.createElement("div");
  controls.className = "filter-controls";
  controls.innerHTML = `<label>Week:</label>`;
  controls.appendChild(weekSelect);
  section.appendChild(controls);

  const list = document.createElement("div");
  list.className = "news-list";

  function updateList() {
    list.innerHTML = "";
    const selected = weekSelect.value;
    const filtered = data.filter((item) => (item.WeekLabel || "Current Week") === selected);

    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.textContent = "No news for this week yet.";
      list.appendChild(empty);
      return;
    }

    filtered.forEach((news) => list.appendChild(createNewsCard(news)));
  }

  weekSelect.addEventListener("change", updateList);
  updateList();
  section.appendChild(list);
  container.appendChild(section);
}
