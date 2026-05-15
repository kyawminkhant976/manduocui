const ADMIN_ACCESS_URL = "./admin.html";
const BRAND_TAP_WINDOW = 650;

function goToAdminAccess() {
    window.location.href = ADMIN_ACCESS_URL;
}

window.addEventListener("keydown", (event) => {
    const isAdminShortcut = (event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "a";
    if (!isAdminShortcut) return;

    event.preventDefault();
    goToAdminAccess();
});

const yearRoot = document.querySelector("#year");
const brandLinks = Array.from(document.querySelectorAll(".brand"));
brandLinks.forEach((brandLink) => {
    let clickCount = 0;
    let clickTimer = null;

    brandLink.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0) {
            return;
        }

        event.preventDefault();
        clickCount += 1;

        if (clickCount >= 2) {
            window.clearTimeout(clickTimer);
            clickCount = 0;
            goToAdminAccess();
            return;
        }

        clickTimer = window.setTimeout(() => {
            clickCount = 0;
            window.location.href = brandLink.href;
        }, BRAND_TAP_WINDOW);
    }, true);
});

if (yearRoot) {
    yearRoot.textContent = new Date().getFullYear();
}

const getScrollTargetTop = (hash) => {
    const target = document.querySelector(hash);
    if (!target) return null;
    const header = document.querySelector(".site-header");
    const offset = header ? header.offsetHeight + 12 : 0;
    return target.getBoundingClientRect().top + window.pageYOffset - offset;
};

const scrollToHash = (hash) => {
    const top = getScrollTargetTop(hash);
    if (top === null) return;
    window.scrollTo({ top, behavior: "smooth" });
};

const isIndexTarget = (url) => {
    return url.pathname.endsWith("/index.html") || url.pathname === "/" || url.pathname === "";
};

const anchorLinks = Array.from(document.querySelectorAll("a[href*='#']"));
anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || !href.includes("#")) return;

        const url = new URL(href, window.location.href);
        if (!isIndexTarget(url)) return;
        if (!url.hash) return;

        if (isIndexTarget(new URL(window.location.href)) && url.hash === window.location.hash) {
            event.preventDefault();
            scrollToHash(url.hash);
        }
    });
});

window.addEventListener("load", () => {
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    if (window.location.hash) {
        window.scrollTo(0, 0);
        setTimeout(() => scrollToHash(window.location.hash), 50);
    }
});
