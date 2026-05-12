import { getProducts } from "./data.js";

const productRoot = document.querySelector("#featuredProducts");
const yearRoot = document.querySelector("#year");

if (yearRoot) {
  yearRoot.textContent = new Date().getFullYear();
}

if (productRoot) {
  const products = getProducts();
  productRoot.innerHTML = products
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
