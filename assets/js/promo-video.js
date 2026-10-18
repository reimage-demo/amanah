(() => {
  "use strict";
  const container = document.querySelector("[data-promo-video]");
  if (!container) return;
  const video = container.querySelector("video");
  const playButton = container.querySelector("[data-video-play]");
  const soundButton = container.querySelector("[data-video-sound]");
  const status = container.querySelector("[data-video-status]");
  const preferenceKey = "amanah.promoVideo.paused.v1";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection;
  let userPaused = false;
  try { userPaused = localStorage.getItem(preferenceKey) === "true"; } catch {}
  let visible = false;
  let pending = false;
  let autoplayBlocked = false;
  let automaticPauses = 0;

  const rememberPause = (paused) => {
    userPaused = paused;
    try {
      if (paused) localStorage.setItem(preferenceKey, "true");
      else localStorage.removeItem(preferenceKey);
    } catch { /* Playback still works when browser storage is unavailable. */ }
  };
  const updateControls = () => {
    playButton.textContent = video.paused ? "Play video" : "Pause video";
    soundButton.textContent = video.muted || video.volume === 0 ? "Turn sound on" : "Mute sound";
  };
  const loadSource = () => {
    if (video.hasAttribute("src")) return;
    const small = window.matchMedia("(max-width: 700px)").matches ||
      connection?.saveData || /(^|-)2g$|^3g$/.test(connection?.effectiveType || "");
    // Assign only one source, and only when playback is actually requested.
    video.src = small ? video.dataset.mobileSrc : video.dataset.src;
    video.load();
  };
  const suspend = () => {
    if (video.paused) return;
    automaticPauses++;
    video.pause();
  };
  const play = async (automatic = false) => {
    if (pending) return;
    pending = true;
    status.textContent = "";
    loadSource();
    try {
      await video.play();
      // Scrolling away or changing a preference while play() is pending must win.
      if (document.hidden || (automatic && (!visible || userPaused ||
        reducedMotion.matches || connection?.saveData))) suspend();
    } catch {
      autoplayBlocked = true;
      status.textContent = video.error
        ? "The video could not load. Please try playing it again."
        : "Select Play video to start watching.";
    } finally {
      pending = false;
      updateControls();
    }
  };
  const syncPlayback = () => {
    if (!visible || document.hidden) {
      suspend();
      return;
    }
    if (!userPaused && !reducedMotion.matches && !connection?.saveData &&
      !autoplayBlocked && !video.ended && video.paused) void play(true);
  };

  playButton.addEventListener("click", () => {
    if (video.paused) {
      rememberPause(false);
      if (video.error) video.load();
      void play();
    } else {
      rememberPause(true);
      video.pause();
    }
  });
  soundButton.addEventListener("click", () => {
    const enable = video.muted || video.volume === 0;
    video.muted = !enable;
    if (enable && video.volume === 0) video.volume = 1;
    updateControls();
  });
  video.addEventListener("play", () => {
    // Native controls and our button both clear an earlier manual pause.
    rememberPause(false);
    status.textContent = "";
    updateControls();
  });
  video.addEventListener("pause", () => {
    if (automaticPauses) automaticPauses--;
    else if (!video.ended && !document.hidden && visible) rememberPause(true);
    updateControls();
  });
  video.addEventListener("ended", updateControls);
  video.addEventListener("volumechange", updateControls);
  video.addEventListener("error", () => {
    autoplayBlocked = true;
    status.textContent = "The video could not load. Please try playing it again.";
    updateControls();
  });
  document.addEventListener("visibilitychange", syncPlayback);
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) suspend();
    else syncPlayback();
  });
  connection?.addEventListener("change", () => {
    if (connection.saveData) suspend();
    else syncPlayback();
  });

  video.muted = true;
  video.hidden = false;
  container.querySelector(".promo-video-actions").hidden = false;
  updateControls();
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.25;
      syncPlayback();
    }, { threshold: [0, 0.25] });
    observer.observe(video);
  }
  // Without IntersectionObserver, playback remains available through the button.
})();
