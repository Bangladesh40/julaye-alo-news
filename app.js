/*
 * জুলাইয়ে আলো — সংবাদ প্রদর্শন
 * নতুন সংবাদ যোগ করতে নিচের NEWS তালিকায় একটি নতুন অবজেক্ট যোগ করুন।
 * প্রকাশের আগে শিরোনাম, তথ্য, তারিখ, ছবি ও সূত্র যাচাই করুন।
 */
const NEWS = [
  // উদাহরণ:
  // {
  //   id: 1,
  //   title: "এখানে যাচাইকৃত সংবাদের শিরোনাম লিখুন",
  //   category: "জাতীয়",
  //   date: "২০২৬-১১-১১",
  //   summary: "সংবাদের সংক্ষিপ্ত বিবরণ লিখুন।",
  //   image: "https://আপনার-ছবির-লিংক.jpg",
  //   body: "এখানে বিস্তারিত সংবাদ লিখুন।",
  //   source: "সংবাদের সূত্র"
  // }
];

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
  return escapeHTML(value);
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
      <p>যাচাইকৃত সংবাদ প্রকাশের জন্য প্রস্তুত। প্রথম সংবাদ যোগ করতে <b>app.js</b> ফাইলের NEWS তালিকা সম্পাদনা করুন।</p>
    </div>`;
    side.innerHTML = `<div class="side-empty"><strong>শীর্ষ সংবাদ</strong><p>এখনো কোনো সংবাদ যোগ করা হয়নি।</p></div>`;
    return;
  }
  const first = items[0];
  lead.innerHTML = `${first.image ? `<img class="story-image" src="${escapeHTML(first.image)}" alt="${escapeHTML(first.title)}" onerror="this.style.display='none'">` : ""}
    <div class="lead-overlay"><span class="tag">${escapeHTML(first.category || "প্রধান সংবাদ")}</span>
    <h1><a href="#article-${encodeURIComponent(first.id)}" class="story-open" data-story-id="${escapeHTML(first.id)}">${escapeHTML(first.title)}</a></h1>
    <span class="meta">${dateLabel(first.date)}</span></div>`;
  side.innerHTML = items.slice(1, 3).map((story) => `<article class="mini-story">
    ${story.image ? `<img src="${escapeHTML(story.image)}" alt="${escapeHTML(story.title)}" loading="lazy">` : `<div class="image-placeholder">জআ</div>`}
    <div><span class="category">${escapeHTML(story.category || "সংবাদ")}</span>
    <h3><a href="#article-${encodeURIComponent(story.id)}" class="story-open" data-story-id="${escapeHTML(story.id)}">${escapeHTML(story.title)}</a></h3>
    <span class="meta">${dateLabel(story.date)}</span></div></article>`).join("");
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
  $("sectionTitle").textContent = activeCategory ? `${activeCategory} সংবাদ` : (searchTerm ? "খোঁজের ফলাফল" : "সর্বশেষ সংবাদ");
  renderLead(NEWS);
  $("newsGrid").innerHTML = items.length
    ? items.map(storyCard).join("")
    : `<div class="empty"><strong>${NEWS.length ? "কোনো সংবাদ পাওয়া যায়নি" : "এখনো সংবাদ প্রকাশ করা হয়নি"}</strong><p>${NEWS.length ? "অন্য শব্দ দিয়ে খুঁজুন অথবা অন্য বিভাগ নির্বাচন করুন।" : "যাচাইকৃত সংবাদ যোগ হলে এখানে দেখা যাবে। সংবাদ যোগ করার নিয়ম README-BN.txt ফাইলে দেওয়া আছে।"}</p></div>`;
}
function openStory(id) {
  const story = NEWS.find((item) => String(item.id) === String(id));
  if (!story) return;
  const modal = $("articleModal");
  $("articleContent").innerHTML = `<span class="category">${escapeHTML(story.category || "সংবাদ")}</span>
    <h2>${escapeHTML(story.title)}</h2><p class="meta">${dateLabel(story.date)}${story.source ? " • সূত্র: " + escapeHTML(story.source) : ""}</p>
    ${story.image ? `<img class="article-image" src="${escapeHTML(story.image)}" alt="${escapeHTML(story.title)}">` : ""}
    <p>${escapeHTML(story.body || story.summary || "")}</p>`;
  modal.hidden = false;
  document.body.classList.add("modal-open");
}
function closeStory() {
  $("articleModal").hidden = true;
  document.body.classList.remove("modal-open");
}
document.addEventListener("DOMContentLoaded", () => {
  $("year").textContent = new Date().getFullYear();
  $("today").textContent = new Intl.DateTimeFormat("bn-BD", { dateStyle: "full" }).format(new Date());
  renderCategories();
  render();
  $("menuToggle").addEventListener("click", () => $("navLinks").classList.toggle("open"));
  $("navLinks").addEventListener("click", (event) => {
    const link = event.target.closest("[data-category]");
    if (link) {
      event.preventDefault();
      activeCategory = link.dataset.category;
      searchTerm = "";
      $("searchInput").value = "";
      $("navLinks").classList.remove("open");
      render();
      $("latest").scrollIntoView({ behavior: "smooth" });
    }
  });
  $("categoryList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = activeCategory === button.dataset.category ? "" : button.dataset.category;
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
});
