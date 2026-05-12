import {
    getProducts,
    upsertProduct,
    removeProduct,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    findProductById
} from "./data.js";

const loginPanel = document.querySelector("#loginPanel");
const dashboardPanel = document.querySelector("#dashboardPanel");
const loginForm = document.querySelector("#loginForm");
const passwordInput = document.querySelector("#password");
const loginError = document.querySelector("#loginError");

const productForm = document.querySelector("#productForm");
const productTable = document.querySelector("#productTableBody");
const imageFile = document.querySelector("#imageFile");
const imageInput = document.querySelector("#image");
const formTitle = document.querySelector("#formTitle");
const actionButton = document.querySelector("#submitButton");
const flash = document.querySelector("#flash");
const clearButton = document.querySelector("#clearButton");
const logoutButton = document.querySelector("#logoutButton");
const yearRoot = document.querySelector("#year");
const deleteConfirmModal = document.getElementById("deleteConfirmModal");
const deleteConfirmMessage = document.getElementById("deleteConfirmMessage");
const deleteConfirmCancel = document.getElementById("deleteConfirmCancel");
const deleteConfirmOk = document.getElementById("deleteConfirmOk");
let pendingDeleteId = null;

if (yearRoot) {
    yearRoot.textContent = new Date().getFullYear();
}

function showFlash(message) {
    if (!flash) return;
    flash.hidden = false;
    flash.textContent = message;
    window.setTimeout(() => {
        flash.hidden = true;
    }, 2400);
}

function refreshTable() {
    const products = getProducts();
    productTable.innerHTML = products
        .map(
            (item) => `
      <tr>
        <td>
          <img src="${item.image}" alt="${item.name}" loading="lazy" style="width:64px;height:64px;object-fit:cover;border-radius:10px;" />
        </td>
        <td>${item.name}</td>
        <td>$${Number(item.price).toLocaleString()}</td>
        <td class="muted">${item.quality}</td>
        <td>
          <button class="secondary" data-action="edit" data-id="${item.id}">Edit</button>
          <button data-action="delete" data-id="${item.id}">Delete</button>
        </td>
      </tr>
      `
        )
        .join("");
}

function resetForm() {
    productForm.reset();
    productForm.id.value = "";
    formTitle.textContent = "Add New Jade Product";
    actionButton.textContent = "Save Product";
}

function setAuthUI() {
    const isAuth = isAdminLoggedIn();
    loginPanel.hidden = isAuth;
    dashboardPanel.hidden = !isAuth;
    if (isAuth) {
        refreshTable();
    }
}

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const ok = adminLogin(passwordInput.value.trim());
        if (!ok) {
            loginError.hidden = false;
            return;
        }
        loginError.hidden = true;
        passwordInput.value = "";
        setAuthUI();
    });
}

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        adminLogout();
        setAuthUI();
    });
}

if (imageFile) {
    imageFile.addEventListener("change", () => {
        const file = imageFile.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            imageInput.value = String(reader.result || "");
        };
        reader.readAsDataURL(file);
    });
}

if (productForm) {
    productForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const payload = {
            id: productForm.id.value.trim(),
            name: productForm.name.value,
            price: productForm.price.value,
            shortDescription: productForm.shortDescription.value,
            description: productForm.description.value,
            type: productForm.type.value,
            origin: productForm.origin.value,
            quality: productForm.quality.value,
            image: productForm.image.value,
            images: [productForm.image.value]
        };

        if (!payload.image) {
            showFlash("Please provide image URL or upload an image.");
            return;
        }

        upsertProduct(payload);
        refreshTable();
        showFlash(payload.id ? "Product updated." : "New product added.");
        resetForm();
    });
}

if (clearButton) {
    clearButton.addEventListener("click", resetForm);
}

const closeDeleteConfirm = () => {
    if (!deleteConfirmModal) return;
    deleteConfirmModal.classList.add("hidden");
    deleteConfirmModal.setAttribute("aria-hidden", "true");
    pendingDeleteId = null;
};

const openDeleteConfirm = (id, productName) => {
    if (!deleteConfirmModal || !deleteConfirmMessage) return;
    pendingDeleteId = id;
    deleteConfirmMessage.textContent = `Delete "${productName}"?`;
    deleteConfirmModal.classList.remove("hidden");
    deleteConfirmModal.setAttribute("aria-hidden", "false");
};

if (deleteConfirmCancel) {
    deleteConfirmCancel.addEventListener("click", closeDeleteConfirm);
}

if (deleteConfirmOk) {
    deleteConfirmOk.addEventListener("click", () => {
        if (!pendingDeleteId) {
            closeDeleteConfirm();
            return;
        }
        removeProduct(pendingDeleteId);
        refreshTable();
        showFlash("Product deleted.");
        closeDeleteConfirm();
    });
}

if (productTable) {
    productTable.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;
        if (!id || !action) return;

        if (action === "delete") {
            const product = findProductById(id);
            openDeleteConfirm(id, product ? product.name : "this product");
            return;
        }

        const product = findProductById(id);
        if (!product) return;

        formTitle.textContent = "Edit Jade Product";
        actionButton.textContent = "Update Product";
        productForm.id.value = product.id;
        productForm.name.value = product.name;
        productForm.price.value = product.price;
        productForm.shortDescription.value = product.shortDescription;
        productForm.description.value = product.description;
        productForm.type.value = product.type;
        productForm.origin.value = product.origin;
        productForm.quality.value = product.quality;
        productForm.image.value = product.image;
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

setAuthUI();
