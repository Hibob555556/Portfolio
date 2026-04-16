const yearNode = document.querySelector("#year");
if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
}

const body = document.body;
const loader = document.querySelector("#loader");
const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll("[data-reveal]");
const glowCards = document.querySelectorAll(
    ".hero-copy, .hero-panel, .project-card, .stack-panel, .about-card, .site-footer"
);

const finishLoading = () => {
    body.classList.remove("is-loading");

    if (!loader) {
        return;
    }

    loader.classList.add("is-hidden");
    window.setTimeout(() => {
        loader.remove();
    }, 550);
};

if (document.readyState === "complete") {
    window.setTimeout(finishLoading, 250);
} else {
    window.addEventListener("load", () => {
        window.setTimeout(finishLoading, 350);
    }, { once: true });
}

const syncHeaderState = () => {
    if (!header) {
        return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 18);
};

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

if ("IntersectionObserver" in window && revealItems.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        // Use a very small threshold so tall article cards still reveal on phones.
        threshold: 0.01,
        rootMargin: "0px 0px -5% 0px"
    });

    revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
        observer.observe(item);
    });
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

glowCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const offsetX = event.clientX - bounds.left - bounds.width / 2;
        const offsetY = event.clientY - bounds.top - bounds.height / 2;

        card.style.setProperty("--glow-x", `${offsetX * 0.18}px`);
        card.style.setProperty("--glow-y", `${offsetY * 0.18}px`);
    });

    card.addEventListener("pointerleave", () => {
        card.style.setProperty("--glow-x", "0px");
        card.style.setProperty("--glow-y", "0px");
    });
});
