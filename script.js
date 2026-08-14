// Starfield (native canvas, subtle mouse parallax)
(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let mouse = { x: 0, y: 0 };

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const count = Math.floor((canvas.width * canvas.height) / 8000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.3,
      depth: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05 - 0.03,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dx = (mouse.x - canvas.width / 2) / canvas.width;
    const dy = (mouse.y - canvas.height / 2) / canvas.height;
    for (const s of stars) {
      s.x = (s.x + s.vx + canvas.width) % canvas.width;
      s.y = (s.y + s.vy + canvas.height) % canvas.height;
      const a = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.phase));
      const ox = s.x + dx * 12 * s.depth;
      const oy = s.y + dy * 12 * s.depth;
      ctx.beginPath();
      ctx.arc(ox, oy, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(246,247,251,${a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  resize();
  draw(0);
})();

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  }
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Active nav link on scroll
const navLinks = document.querySelectorAll('.nav__links a');
const sectionObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  }
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('section[id]').forEach((s) => sectionObserver.observe(s));

// Journey trajectory line fills with scroll progress through the section
const timeline = document.querySelector('.timeline');
const progress = document.getElementById('timelineProgress');
function updateTimelineProgress() {
  if (!timeline || !progress) return;
  const rect = timeline.getBoundingClientRect();
  const viewportMid = window.innerHeight * 0.6;
  const ratio = (viewportMid - rect.top) / rect.height;
  progress.style.height = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
}
window.addEventListener('scroll', () => requestAnimationFrame(updateTimelineProgress), { passive: true });
updateTimelineProgress();

// Hover-to-play project videos
document.querySelectorAll('[data-hover-video]').forEach((video) => {
  const card = video.closest('.project-card');
  card.addEventListener('mouseenter', () => video.play());
  card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});
