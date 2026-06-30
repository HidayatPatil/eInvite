const TOTAL_FRAMES = 93;
const canvas = document.getElementById('scroll-canvas');
const ctx = canvas.getContext('2d');
const loading = document.getElementById('loading');

function framePath(i) {
  return `/video_frames/web_video_${String(i).padStart(5, '0')}.png`;
}

function preloadFrames() {
  return new Promise((resolve) => {
    const frames = [];
    let loaded = 0;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) resolve(frames);
      };
      frames.push(img);
    }
  });
}

function drawFrame(frames, index) {
  const img = frames[index];
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);
}

preloadFrames().then((frames) => {
  loading.style.display = 'none';
  drawFrame(frames, 0);

  let rafId = null;

  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = window.scrollY / maxScroll;
      const index = Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1);
      drawFrame(frames, index);
      rafId = null;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
});
