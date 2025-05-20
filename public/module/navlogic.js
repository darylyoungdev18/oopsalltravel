export function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('show');
  }
  window.toggleMenu = toggleMenu;