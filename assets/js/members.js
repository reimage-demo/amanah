(() => {
  const list = document.querySelector('#members-list');
  const status = document.querySelector('#members-status');
  const more = document.querySelector('#members-more');
  const retry = document.querySelector('#members-retry');
  let cursor = null, busy = false, count = 0;
  async function load() {
    if (busy) return;
    busy = true;
    more.disabled = true;
    retry.hidden = true;
    status.textContent = 'Loading our community…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const endpoint = window.AMANAH_CONFIG?.convexSiteUrl;
      if (!/^https:\/\/[a-z0-9-]+\.convex\.site$/.test(endpoint || '')) throw new Error('Unavailable');
      const response = await fetch(endpoint + '/members' + (cursor ? '?cursor=' + encodeURIComponent(cursor) : ''), { signal: controller.signal, cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.members) || !(data.cursor === null || typeof data.cursor === 'string') || !data.members.every(member => typeof member.name === 'string')) throw new Error('Unavailable');
      for (const member of data.members) {
        const li = document.createElement('li');
        // Treat names as text, never HTML, including self-submitted names.
        li.textContent = member.name;
        list.append(li);
      }
      count += data.members.length;
      cursor = data.cursor;
      more.hidden = !cursor;
      status.textContent = count ? `${count} community ${count === 1 ? 'name' : 'names'} shown.` : 'Our community is taking shape. Names will appear here as physicians choose to share them.';
    } catch {
      status.textContent = 'We could not load the member directory. Please try again.';
      retry.hidden = false;
    } finally {
      clearTimeout(timeout);
      busy = false;
      more.disabled = false;
    }
  }
  more.addEventListener('click', load);
  retry.addEventListener('click', load);
  load();
})();
