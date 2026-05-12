import { getProducts } from "./data.js";

const root = document.querySelector("#productList");
const count = document.querySelector("#productCount");
const searchInput = document.querySelector("#productSearch");
const sortSelect = document.querySelector("#productSort");
const yearRoot = document.querySelector("#year");

const products = getProducts();

function renderProducts(items) {
  if (count) {
    count.textContent = String(items.length);
  }

  if (!root) {
    return;
  }

  root.innerHTML = items
    .map(
      (item, index) => `
      <article class="card reveal delay-${Math.min(index, 3)}">
        <a href="product.html?id=${encodeURIComponent(item.id)}" aria-label="View ${item.name}">
          <div class="image-frame" style="aspect-ratio: 5 / 4;">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </div>
          <div class="card-body">
            <h3>${item.name}</h3>
            <p class="price">$${Number(item.price).toLocaleString()}</p>
            <p class="muted">${item.shortDescription}</p>
          </div>
        </a>
      </article>
      `
    )
    .join("");
}

function applyFilters() {
  const query = searchInput?.value.trim().toLowerCase() || "";
  const sortValue = sortSelect?.value || "default";

  let filtered = products.filter((item) => {
    const nameText = item.name.toLowerCase();
    const descriptionText = item.shortDescription.toLowerCase();
    return nameText.includes(query) || descriptionText.includes(query);
  });

  if (sortValue === "price-asc") {
    filtered = filtered.slice().sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortValue === "price-desc") {
    filtered = filtered.slice().sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortValue === "name-asc") {
    filtered = filtered.slice().sort((a, b) => a.name.localeCompare(b.name));
  }

  renderProducts(filtered);
}

if (yearRoot) {
  yearRoot.textContent = new Date().getFullYear();
}

if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

if (sortSelect) {
  sortSelect.addEventListener("change", applyFilters);
}

renderProducts(products);
