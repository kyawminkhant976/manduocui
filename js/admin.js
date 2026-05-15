import {
    getProducts,
    createProduct,
    updateProduct,
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
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
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

async function refreshTable() {
    const products = await getProducts();
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

async function setAuthUI() {
    const isAuth = isAdminLoggedIn();
    loginPanel.hidden = isAuth;
    dashboardPanel.hidden = !isAuth;
    if (isAuth) {
        await refreshTable();
    }
}

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
            await adminLogin(passwordInput.value.trim());
            loginError.hidden = true;
            passwordInput.value = "";
            await setAuthUI();
        } catch (error) {
            loginError.hidden = false;
            console.error('Admin login failed:', error);
        }
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

        if (file.size > MAX_IMAGE_SIZE) {
            imageFile.value = "";
            imageInput.value = "";
            showFlash("Image is too large. Please use an image under 5 MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            imageInput.value = String(reader.result || "");
        };
        reader.readAsDataURL(file);
    });
}

if (productForm) {
    productForm.addEventListener("submit", async (event) => {
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

        try {
            if (payload.id) {
                await updateProduct(payload.id, payload);
                showFlash("Product updated.");
            } else {
                delete payload.id;
                await createProduct(payload);
                showFlash("New product added.");
            }
            await refreshTable();
            resetForm();
        } catch (error) {
            showFlash("Could not save product. Please try again.");
            console.error('Product save failed:', error);
        }
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
    deleteConfirmOk.addEventListener("click", async () => {
        if (!pendingDeleteId) {
            closeDeleteConfirm();
            return;
        }
        try {
            await removeProduct(pendingDeleteId);
            await refreshTable();
            showFlash("Product deleted.");
            closeDeleteConfirm();
        } catch (error) {
            showFlash("Could not delete product. Please try again.");
            console.error('Product delete failed:', error);
        }
    });
}

if (productTable) {
    productTable.addEventListener("click", async (event) => {
        const button = event.target.closest("button");
        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;
        if (!id || !action) return;

        if (action === "delete") {
            const product = await findProductById(id);
            openDeleteConfirm(id, product ? product.name : "this product");
            return;
        }

        const product = await findProductById(id);
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
