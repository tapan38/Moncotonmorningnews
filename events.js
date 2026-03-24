function createEventCard(entry) {
  const card = document.createElement("article");
  card.className = "event-item";

  const title = document.createElement("h3");
  const link = document.createElement("a");
  link.href = entry.SourceLink || "#";
  link.textContent = entry.Title || "Event";
  link.target = "_blank";
  link.rel = "noreferrer";
  title.appendChild(link);

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.innerHTML = `<span>${entry.Date || "TBD"}</span><span>${entry.Location || "Moncton"}</span>`;

  card.append(title, meta);
  return card;
}

export function renderEvents(container, data) {
  container.innerHTML = "";
  const section = document.createElement("section");
  section.className = "section-card";

  section.innerHTML = `
    <div>
      <p class="eyebrow">Newsletter Exclusive</p>
      <h2>Community events this week</h2>
      <p class="notice">Use ?tab=events to surface this view.</p>
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
  list.className = "events-list";

  function updateList() {
    list.innerHTML = "";
    const selected = weekSelect.value;
    const filtered = data.filter((item) => (item.WeekLabel || "Current Week") === selected);

    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.textContent = "No events for this week yet.";
      list.appendChild(empty);
      return;
    }

    filtered.forEach((entry) => list.appendChild(createEventCard(entry)));
  }

  weekSelect.addEventListener("change", updateList);
  updateList();
  section.appendChild(list);
  container.appendChild(section);
}
