document.addEventListener("DOMContentLoaded", () => {
  // Slideshow controls
  const root = document.querySelector(".slideshow");
  if (!root) return;

  const slides = Array.from(root.querySelectorAll(".slide"));
  const prevBtn = root.querySelector(".slide-btn.prev");
  const nextBtn = root.querySelector(".slide-btn.next");

  if (!slides.length || !prevBtn || !nextBtn) return;

  let idx = slides.findIndex(s => s.classList.contains("active"));
  if (idx < 0) idx = 0;

  function show(i) {
    slides.forEach(s => s.classList.remove("active"));
    slides[i].classList.add("active");
  }

  function prev() {
    idx = (idx - 1 + slides.length) % slides.length;
    show(idx);
  }

  function next() {
    idx = (idx + 1) % slides.length;
    show(idx);
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  // Keyboard support (← / →)
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });
});
