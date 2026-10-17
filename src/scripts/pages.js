/* Secondary pages: the phone menu only. */
const nav = document.querySelector('[data-nav]');
const toggle = document.querySelector('[data-nav-toggle]');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});
/* Escape closes the menu and hands focus back to its button, so focus
   never stays inside the hidden list. */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }
});
