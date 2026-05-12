import { findProductById } from "./data.js";

const yearRoot = document.querySelector("#year");
if (yearRoot) {
    yearRoot.textContent = new Date().getFullYear();
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const product = id ? findProductById(id) : null;

const titleRoot = document.querySelector("#detailTitle");
const priceRoot = document.querySelector("#detailPrice");
const descRoot = document.querySelector("#detailDescription");
const typeRoot = document.querySelector("#detailType");
const originRoot = document.querySelector("#detailOrigin");
const qualityRoot = document.querySelector("#detailQuality");
const mainImage = document.querySelector("#mainImage");
const thumbs = document.querySelector("#detailThumbs");
const notFound = document.querySelector("#notFound");
const content = document.querySelector("#detailContent");

if (!product) {
    if (notFound) {
        notFound.hidden = false;
    }
    if (content) {
        content.hidden = true;
    }
} else {
    document.title = `${product.name} | 满多翠`;
    titleRoot.textContent = product.name;
    priceRoot.textContent = `$${Number(product.price).toLocaleString()}`;
    descRoot.textContent = product.description;
    typeRoot.textContent = product.type;
    originRoot.textContent = product.origin;
    qualityRoot.textContent = product.quality;
    mainImage.src = product.image;
    mainImage.alt = product.name;

    const gallery = product.images?.length ? product.images : [product.image];
    thumbs.innerHTML = gallery
        .map(
            (img, index) => `
      <button class="thumb ${index === 0 ? "active" : ""}" data-image="${img}" aria-label="Show image ${index + 1}">
        <img src="${img}" alt="${product.name} view ${index + 1}" loading="lazy" />
      </button>
      `
        )
        .join("");

    thumbs.addEventListener("click", (event) => {
        const target = event.target.closest(".thumb");
        if (!target) return;

        const imageUrl = target.dataset.image;
        if (!imageUrl) return;

        mainImage.src = imageUrl;
        [...thumbs.querySelectorAll(".thumb")].forEach((el) => {
            el.classList.remove("active");
        });
        target.classList.add("active");
    });
}
