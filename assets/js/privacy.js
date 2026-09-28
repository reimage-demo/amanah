(() => {
  const key = 'amanah.storageNotice.v1';
  const notice = document.createElement('aside');
  notice.className = 'storage-notice';
  notice.setAttribute('aria-label', 'Browser storage notice');
  notice.hidden = true;
  const text = document.createElement('p');
  text.textContent = 'No advertising or analytics trackers. We use browser storage to remember dismissal of this notice.';
  const link = document.createElement('a');
  link.href = 'cookies.html';
  link.textContent = 'Cookies & storage';
  const dismiss = document.createElement('button');
  dismiss.type = 'button';
  dismiss.textContent = 'Dismiss notice';
  let opener;
  dismiss.addEventListener('click', () => {
    try { localStorage.setItem(key, String(Date.now())); } catch {}
    notice.hidden = true;
    opener?.focus();
  });
  notice.append(text, link, dismiss);
  document.body.append(notice);
  let last = 0;
  try { last = Number(localStorage.getItem(key)) || 0; } catch {}
  if (!last || Date.now() - last > 180 * 24 * 60 * 60 * 1000) notice.hidden = false;
  document.querySelectorAll('[data-storage-notice]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      notice.hidden = false;
      dismiss.focus();
    });
  });
})();
