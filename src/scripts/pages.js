/* Secondary pages: the phone menu only. */
const nav = document.querySelector('[data-nav]');
const toggle = document.querySelector('[data-nav-toggle]');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});
