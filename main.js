const filterButtons = document.querySelectorAll(".report-filter__option");
const categoryElements = document.querySelectorAll(".report__category");

let data = null;

const periods = {
  daily: "Yesterday",
  weekly: "Last Week",
  monthly: "Last Month",
};

function formatHours(hours) {
  return hours === 1 ? "1hr" : `${hours}hrs`;
}

function render(period) {
  categoryElements.forEach((el) => {
    const category = el.dataset.category;
    const entry = data.find(
      (item) => item.title.toLowerCase().replace(" ", "-") === category,
    );
    if (!entry) return;

    const { current, previous } = entry.timeframes[period];
    const card = el.closest(".report__content");

    card.querySelector(".report__current").textContent = formatHours(current);
    card.querySelector(".report__previous").textContent =
      `${periods[period]} - ${formatHours(previous)}`;
  });
}

async function init() {
  try {
    const res = await fetch("./data.json");
    if (!res.ok) throw new Error("Gagal memuat data.json");
    data = await res.json();
    render("daily");
  } catch (err) {
    console.error(err);
    document.querySelectorAll(".report__current").forEach((el) => {
      el.textContent = "Error";
    });
  }
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!data) return;
    filterButtons.forEach((b) =>
      b.classList.remove("report-filter__option--active"),
    );
    btn.classList.add("report-filter__option--active");
    render(btn.dataset.period);
  });
});

init();
