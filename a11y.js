// Accessibility menu: self-hosted, no third-party overlay. Settings are a per-visitor
// convenience, so storage failures (private mode, blocked storage) are ignored.
(function () {
  var KEY = 'bb-a11y';
  var OPTIONS = [
    ['a11y-big', 'הגדלת טקסט'],
    ['a11y-contrast', 'ניגודיות גבוהה'],
    ['a11y-links', 'הדגשת קישורים'],
    ['a11y-readable', 'גופן קריא'],
    ['a11y-noanim', 'עצירת אנימציות']
  ];
  var root = document.documentElement;
  var saved = [];
  try { saved = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {}
  saved.forEach(function (c) { root.classList.add(c); });

  function persist() {
    var on = OPTIONS.map(function (o) { return o[0]; }).filter(function (c) { return root.classList.contains(c); });
    try { localStorage.setItem(KEY, JSON.stringify(on)); } catch (e) {}
  }

  var btn = document.createElement('button');
  btn.className = 'a11y-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'תפריט נגישות');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'a11y-panel');
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.5" r="1.8" fill="currentColor"/><path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M12 14.5 9 21M12 14.5l3 6.5"/></g></svg>';

  var panel = document.createElement('div');
  panel.className = 'a11y-panel';
  panel.id = 'a11y-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', 'a11y-title');
  var html = '<h2 id="a11y-title">התאמות נגישות</h2><div class="grid">';
  OPTIONS.forEach(function (o) {
    html += '<button type="button" data-c="' + o[0] + '" aria-pressed="' + root.classList.contains(o[0]) + '">' + o[1] + '</button>';
  });
  html += '<button type="button" data-reset>איפוס</button></div>' +
    '<div class="row"><a href="accessibility.html">הצהרת נגישות</a><button type="button" data-close>סגירה</button></div>';
  panel.innerHTML = html;

  function setOpen(open) {
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) panel.querySelector('button').focus(); else btn.focus();
  }

  btn.addEventListener('click', function () { setOpen(panel.hidden); });
  panel.addEventListener('click', function (e) {
    var t = e.target.closest('button');
    if (!t) return;
    if (t.hasAttribute('data-close')) return setOpen(false);
    if (t.hasAttribute('data-reset')) {
      OPTIONS.forEach(function (o) { root.classList.remove(o[0]); });
      panel.querySelectorAll('[data-c]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      return persist();
    }
    var on = root.classList.toggle(t.dataset.c);
    t.setAttribute('aria-pressed', String(on));
    persist();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) setOpen(false);
  });

  var aside = document.createElement('aside');
  aside.setAttribute('aria-label', 'נגישות');
  aside.appendChild(btn);
  aside.appendChild(panel);
  document.body.appendChild(aside);
})();
