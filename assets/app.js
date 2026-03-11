const body = document.body;
const drawer = document.getElementById('mobile-drawer');
const burger = document.querySelector('.burger');
const closeBtn = document.querySelector('.drawer-close');
let lastFocus = null;

const focusableSelector = 'a[href], button, input, [tabindex]:not([tabindex="-1"])';

function lockScroll(locked) {
  body.style.overflow = locked ? 'hidden' : '';
}

function trapFocus(container, event) {
  if (event.key !== 'Tab') return;
  const nodes = [...container.querySelectorAll(focusableSelector)];
  if (!nodes.length) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function openDrawer() {
  if (!drawer) return;
  lastFocus = document.activeElement;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  burger?.setAttribute('aria-expanded', 'true');
  lockScroll(true);
  drawer.querySelector(focusableSelector)?.focus();
}

function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  burger?.setAttribute('aria-expanded', 'false');
  lockScroll(false);
  lastFocus?.focus();
}

burger?.addEventListener('click', openDrawer);
closeBtn?.addEventListener('click', closeDrawer);
drawer?.addEventListener('click', (e) => {
  if (e.target === drawer) closeDrawer();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrawer();
    closePrivacy();
    document.querySelectorAll('.lang.open').forEach((l) => l.classList.remove('open'));
  }
  if (drawer?.classList.contains('open')) trapFocus(drawer.querySelector('.drawer-panel'), e);
  if (privacyModal?.classList.contains('open')) trapFocus(privacyModal.querySelector('.modal-panel'), e);
});

document.querySelectorAll('[data-dropdown]').forEach((group) => {
  const btn = group.querySelector('.lang-trigger');
  btn?.addEventListener('click', () => {
    const open = group.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-dropdown]')) {
    document.querySelectorAll('[data-dropdown]').forEach((d) => {
      d.classList.remove('open');
      d.querySelector('.lang-trigger')?.setAttribute('aria-expanded', 'false');
    });
  }
});

document.querySelectorAll('[data-accordion] .faq-item button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const content = item.querySelector('.faq-content');
    const willOpen = !content.classList.contains('open');
    document.querySelectorAll('[data-accordion] .faq-content').forEach((c) => c.classList.remove('open'));
    document.querySelectorAll('[data-accordion] .faq-item button').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    if (willOpen) {
      content.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

const privacyModal = document.getElementById('privacy-modal');
const openPrivacyBtn = document.querySelector('[data-open-privacy]');
let lastPrivacyFocus = null;

function openPrivacy() {
  if (!privacyModal) return;
  lastPrivacyFocus = document.activeElement;
  privacyModal.classList.add('open');
  privacyModal.setAttribute('aria-hidden', 'false');
  lockScroll(true);
  privacyModal.querySelector(focusableSelector)?.focus();
}

function closePrivacy() {
  if (!privacyModal) return;
  privacyModal.classList.remove('open');
  privacyModal.setAttribute('aria-hidden', 'true');
  lockScroll(false);
  lastPrivacyFocus?.focus();
}

openPrivacyBtn?.addEventListener('click', openPrivacy);
document.querySelectorAll('[data-close-privacy]').forEach((btn) => btn.addEventListener('click', closePrivacy));
privacyModal?.addEventListener('click', (e) => {
  if (e.target === privacyModal) closePrivacy();
});

document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const notice = document.createElement('p');
    notice.textContent = 'Thank you. After you sign up, you will see a clear setup checklist.';
    notice.className = 'muted';
    form.appendChild(notice);
  });
});

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
