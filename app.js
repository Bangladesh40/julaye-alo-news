
/*
 * জুলাইয়ের আলো — Supabase সংবাদ প্রদর্শন
 */

const SUPABASE_URL = "https://elyukvkolnphhlzfzedl.supabase.co";
const SUPABASE_KEY = "sb_publishable_jvq6A9pn5bDJBZbZcIhCZg_3Dux7u52";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let NEWS = [];
const CATEGORIES = ["জাতীয়", "রাজনীতি", "সারাদেশ", "চট্টগ্রাম", "সাতকানিয়া", "আন্তর্জাতিক", "খেলাধুলা", "বিনোদন", "প্রযুক্তি"];

const $ = (id) => document.getElementById(id);
let activeCategory = "";
let searchTerm = "";

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function dateLabel(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return escapeHTML(value);
  return escapeHTML(new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium"
  }).format(date));
}

function storyCard(story) {
  const image = story.image
    ? `<img src="${escapeHTML(story.image)}" alt="${escapeHTML(story.title)}" loading="lazy" onerror="this.style.display='none'">`
    : `<div class="image-placeholder" aria-hidden="true">জুলাইয়ে আলো</div>`;

  return `<article class="news-card">
    <a href="#article-${encodeURIComponent(story.id)}" class="story-open" data-story-id="${escapeHTML(story.id)}">
      ${image}
      <span class="category">${escapeHTML(story.category || "সংবাদ")}</span>
      <h3>${escapeHTML(story.title)}</h3>
    </a>
    <p>${escapeHTML(story.summary || "")}</p>
    <span class="meta">${dateLabel(story.date)}</span>
  </article>`;
}

function renderLead(items) {
  const lead = $("leadStory");
  const side = $("sideLeads");

  if (!items.length) {
    lead.innerHTML = `<div class="lead-empty">
      <span class="lead-empty-mark">জআ</span>
      <span class="tag">প্রধান সংবাদ</span>
      <h1>জুলাইয়ে আলোতে স্বাগতম</h1>
      <p>যাচাইকৃত সংবাদ প্রকাশের জন্য প্রস্তুত।</p>
    </div>`;
    side.innerHTML = `<div class="side-empty"><strong>শীর্ষ সংবাদ</strong><p>এখনো কোনো সংবাদ যোগ করা হয়নি।</p></div>`;
    return;
  }

  const first = items[0];

  lead.innerHTML = `${first.image ? `<img class="story-image" src="${escapeHTML(first.image)}" alt="${escapeHTML(first.title)}">` : ""}
    <div class="lead-overlay">
      <span class="tag">${escapeHTML(first.category || "প্রধান সংবাদ")}</span>
      <h1><a href="#article-${encodeURIComponent(first.id)}" class="story-open" data-story-id="${escapeHTML(first.id)}">${escapeHTML(first.title)}</a></h1>
      <span class="meta">${dateLabel(first.date)}</span>
    </div>`;

  side.innerHTML = items.slice(1, 3).map((story) => `<article class="mini-story">
    ${story.image ? `<img src="${escapeHTML(story.image)}" alt="${escapeHTML(story.title)}" loading="lazy">` : `<div class="image-placeholder">জআ</div>`}
    <div>
      <span class="category">${escapeHTML(story.category || "সংবাদ")}</span>
      <h3><a href="#article-${encodeURIComponent(story.id)}" class="story-open" data-story-id="${escapeHTML(story.id)}">${escapeHTML(story.title)}</a></h3>
      <span class="meta">${dateLabel(story.date)}</span>
    </div>
  </article>`).join("");
}

function renderCategories() {
  $("categoryList").innerHTML = CATEGORIES.map((category) =>
    `<button type="button" data-category="${escapeHTML(category)}">${escapeHTML(category)}</button>`
  ).join("");
}

function filteredNews() {
  return NEWS.filter((story) => {
    const categoryMatch = !activeCategory || story.category === activeCategory;
    const haystack = `${story.title || ""} ${story.summary || ""} ${story.body || ""} ${story.category || ""}`.toLocaleLowerCase("bn");
    return categoryMatch && (!searchTerm || haystack.includes(searchTerm));
  });
}

function render() {
  const items = filteredNews();

  $("sectionTitle").textContent = activeCategory
    ? `${activeCategory} সংবাদ`
    : (searchTerm ? "খোঁজের ফলাফল" : "সর্বশেষ সংবাদ");

  renderLead(NEWS);

  $("newsGrid").innerHTML = items.length
    ? items.map(storyCard).join("")
    : `<div class="empty">
        <strong>${NEWS.length ? "কোনো সংবাদ পাওয়া যায়নি" : "এখনো সংবাদ প্রকাশ করা হয়নি"}</strong>
        <p>${NEWS.length ? "অন্য শব্দ দিয়ে খুঁজুন অথবা অন্য বিভাগ নির্বাচন করুন।" : "যাচাইকৃত সংবাদ যোগ হলে এখানে দেখা যাবে।"}</p>
      </div>`;
}

function openStory(id) {
  const story = NEWS.find((item) => String(item.id) === String(id));
  if (!story) return;

  $("articleContent").innerHTML = `
    <span class="category">${escapeHTML(story.category || "সংবাদ")}</span>
    <h2>${escapeHTML(story.title)}</h2>
    <p class="meta">${dateLabel(story.date)}</p>
    ${story.image ? `<img class="article-image" src="${escapeHTML(story.image)}" alt="${escapeHTML(story.title)}">` : ""}
    <p>${escapeHTML(story.body || story.summary || "")}</p>`;

  $("articleModal").hidden = false;
  document.body.classList.add("modal-open");
}

function closeStory() {
  $("articleModal").hidden = true;
  document.body.classList.remove("modal-open");
}

async function loadNews() {
  $("newsGrid").innerHTML = "<p>সংবাদ লোড হচ্ছে...</p>";

  const { data, error } = await db
    .from("news")
    .select("id,title,content,category,image_url,created_at,published")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase news error:", error);
    $("newsGrid").innerHTML = "<p>সংবাদ লোড করা যায়নি। ডেটাবেসের অনুমতি পরীক্ষা করতে হবে।</p>";
    return;
  }

  NEWS = (data || []).map((item) => {
    const body = item.content || "";
    return {
      id: item.id,
      title: item.title || "",
      category: item.category || "জাতীয়",
      date: item.created_at || "",
      summary: body.length > 160 ? body.slice(0, 160) + "..." : body,
      body,
      image: item.image_url || ""
    };
  });

  render();
}

document.addEventListener("DOMContentLoaded", async () => {
  $("year").textContent = new Date().getFullYear();
  $("today").textContent = new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "full"
  }).format(new Date());

  renderCategories();

  $("menuToggle").addEventListener("click", () =>
    $("navLinks").classList.toggle("open")
  );

  $("navLinks").addEventListener("click", (event) => {
    const link = event.target.closest("[data-category]");
    if (!link) return;

    event.preventDefault();
    activeCategory = link.dataset.category;
    searchTerm = "";
    $("searchInput").value = "";
    $("navLinks").classList.remove("open");
    render();
    $("latest").scrollIntoView({ behavior: "smooth" });
  });

  $("categoryList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    activeCategory = activeCategory === button.dataset.category
      ? "" : button.dataset.category;
    render();
  });

  $("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    searchTerm = $("searchInput").value.trim().toLocaleLowerCase("bn");
    activeCategory = "";
    render();
    $("latest").scrollIntoView({ behavior: "smooth" });
  });

  $("showAll").addEventListener("click", () => {
    activeCategory = "";
    searchTerm = "";
    $("searchInput").value = "";
    render();
  });

  document.addEventListener("click", (event) => {
    const storyLink = event.target.closest("[data-story-id]");
    if (storyLink) {
      event.preventDefault();
      openStory(storyLink.dataset.storyId);
    }

    if (event.target.matches("[data-close-modal]")) closeStory();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeStory();
  });

  await loadNews();
});
