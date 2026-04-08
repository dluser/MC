/**
 * Site UI helpers
 *
 * Responsibilities:
 * 1. Keep the footer year current.
 * 2. Highlight the active section link as the user scrolls.
 *
 * Notes for future maintainers:
 * - The navigation highlight depends on section IDs matching nav href fragments.
 * - Keep this file small and focused on progressive enhancement.
 * - If JavaScript fails, the page should still remain fully usable.
 */
document.addEventListener("DOMContentLoaded", () => {
  updateFooterYear();
  initializeSectionNavigation();
});

function updateFooterYear() {
  const yearElement = document.getElementById("year");

  if (!yearElement) {
    return;
  }

  yearElement.textContent = String(new Date().getFullYear());
}

function initializeSectionNavigation() {
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".section-nav a"));

  if (sections.length === 0 || navLinks.length === 0) {
    return;
  }

  const linksBySectionId = new Map(
    navLinks
      .map((link) => {
        const href = link.getAttribute("href");
        const sectionId = href?.startsWith("#") ? href.slice(1) : null;

        return sectionId ? [sectionId, link] : null;
      })
      .filter(Boolean)
  );

  let activeSectionId = "";

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length === 0) {
        return;
      }

      const nextActiveSectionId = visibleEntries[0].target.id;

      if (nextActiveSectionId === activeSectionId) {
        return;
      }

      activeSectionId = nextActiveSectionId;
      syncActiveNavigationLink(activeSectionId, navLinks, linksBySectionId);
    },
    {
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0.15, 0.3, 0.45, 0.6],
    }
  );

  sections.forEach((section) => observer.observe(section));

  // Set a sensible initial state for users who load mid-page.
  const firstSection = sections[0];
  if (firstSection) {
    syncActiveNavigationLink(firstSection.id, navLinks, linksBySectionId);
  }
}

function syncActiveNavigationLink(sectionId, navLinks, linksBySectionId) {
  navLinks.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
  });

  const activeLink = linksBySectionId.get(sectionId);

  if (!activeLink) {
    return;
  }

  activeLink.classList.add("active");
  activeLink.setAttribute("aria-current", "true");
}
