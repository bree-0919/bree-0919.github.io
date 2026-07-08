if (window.lucide) {
  window.lucide.createIcons();
}

const navLinks = document.querySelectorAll(".nav-link");
const currentPage = document.body.dataset.page;

const activatePageLink = () => {
  if (!currentPage) {
    return;
  }

  const activePage = window.location.hash === "#contact" ? "contact" : currentPage;

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.page === activePage);
  });
};

activatePageLink();
window.addEventListener("hashchange", activatePageLink);