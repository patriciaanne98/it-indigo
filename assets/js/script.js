window.addEventListener('scroll', () => {
  if (window.scrollY > 10) document.body.classList.add('scrolled');
}, { passive: true });
