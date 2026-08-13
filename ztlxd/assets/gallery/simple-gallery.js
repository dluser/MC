document.addEventListener('DOMContentLoaded', function () {
  var AUTOPLAY_MS = 3000;

  // --- shared lightbox, one per page ---
  var lightbox = document.createElement('div');
  lightbox.className = 'simple-gallery-lightbox';
  lightbox.innerHTML =
    '<button class="simple-gallery-lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="simple-gallery-lightbox-btn simple-gallery-lightbox-prev" aria-label="Previous image">&#8249;</button>' +
    '<img alt="">' +
    '<button class="simple-gallery-lightbox-btn simple-gallery-lightbox-next" aria-label="Next image">&#8250;</button>';
  document.body.appendChild(lightbox);

  var lbImg = lightbox.querySelector('img');
  var lbClose = lightbox.querySelector('.simple-gallery-lightbox-close');
  var lbPrev = lightbox.querySelector('.simple-gallery-lightbox-prev');
  var lbNext = lightbox.querySelector('.simple-gallery-lightbox-next');

  var activeGallery = null; // { srcs, index, setIndex }

  function openLightbox(gallery, index) {
    activeGallery = gallery;
    lightbox.setAttribute('data-count', gallery.srcs.length);
    showLightboxImage(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function showLightboxImage(index) {
    if (!activeGallery) return;
    var srcs = activeGallery.srcs;
    index = (index + srcs.length) % srcs.length;
    activeGallery.index = index;
    lbImg.src = srcs[index];
    activeGallery.setIndex(index);
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    activeGallery = null;
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  lbPrev.addEventListener('click', function () { showLightboxImage(activeGallery.index - 1); });
  lbNext.addEventListener('click', function () { showLightboxImage(activeGallery.index + 1); });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(activeGallery.index - 1);
    if (e.key === 'ArrowRight') showLightboxImage(activeGallery.index + 1);
  });

  // --- each carousel ---
  document.querySelectorAll('.simple-gallery').forEach(function (gallery) {
    var track = gallery.querySelector('.simple-gallery-track');
    var slides = gallery.querySelectorAll('.simple-gallery-slide');
    var dots = gallery.querySelectorAll('.simple-gallery-dot');
    var imgs = gallery.querySelectorAll('.simple-gallery-slide img');
    var srcs = Array.prototype.map.call(imgs, function (img) { return img.getAttribute('src'); });
    var count = slides.length;
    var index = 0;
    var timer = null;

    function show(i) {
      index = (i + count) % count;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (d, di) { d.classList.toggle('active', di === index); });
    }

    function startAutoplay() {
      stopAutoplay();
      if (count > 1) timer = setInterval(function () { show(index + 1); }, AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    var prev = gallery.querySelector('.simple-gallery-prev');
    var next = gallery.querySelector('.simple-gallery-next');
    if (prev) prev.addEventListener('click', function () { show(index - 1); startAutoplay(); });
    if (next) next.addEventListener('click', function () { show(index + 1); startAutoplay(); });
    dots.forEach(function (d, di) { d.addEventListener('click', function () { show(di); startAutoplay(); }); });

    imgs.forEach(function (img, i) {
      img.addEventListener('click', function () {
        openLightbox({
          srcs: srcs,
          index: i,
          setIndex: function (newIndex) { show(newIndex); }
        }, i);
      });
    });

    gallery.addEventListener('mouseenter', stopAutoplay);
    gallery.addEventListener('mouseleave', startAutoplay);

    show(0);
    startAutoplay();
  });
});
