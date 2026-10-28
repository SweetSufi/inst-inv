/* Investigation 11 — Rabbit Hole: navigation, state and Research Trail.
   Deterministic: reads prepared entries through RH.provider. No network calls. */
(function () {
  const RH = window.RH, P = RH.provider, $ = (s) => document.querySelector(s);
  const exp = $('#experience'), view = $('#view'), live = $('#live'), aliceLine = $('#alice-line');
  const KEY = 'rh11-state-v1';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const DEPTH = [[28, 40], [34, 44], [48, 60], [64, 76], [78, 88]];
  const ALICE = [
    'Five doors, one archive. Every answer here opens a deeper question. Pick one.',
    'Start at the top. The light is warm up here, and it won’t stay that way.',
    'The stairs go on. Look at how the shelves change.',
    'It’s getting blue down here. Everything is more specific now.',
    'The Lowest Floor. This is as deep as this pathway goes.'
  ];
  const ALICE_END = 'That’s your trail. Copy it, keep it, or go back down a different way.';

  let S = load() || { view: 'intro', qid: null, path: [], seen: {} };

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (!s || !Array.isArray(s.path)) return null;
      if (s.path.some((p) => !RH.nodes[p.id])) return null;
      return s;
    } catch (e) { return null; }
  }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const cur = () => S.path[S.path.length - 1];
  const node = (id) => P.getNode(id, S.path);
  const qOf = (id) => RH.questions.find((q) => q.id === id);
  const mark = (id) => { const a = (S.seen[S.qid] = S.seen[S.qid] || []); if (!a.includes(id)) a.push(id); };

  /* ---------- state actions ---------- */
  function start(qid) {
    S.qid = qid; S.view = 'node';
    const root = P.getRoot(qid);
    S.path = [{ id: root.id, via: null }]; mark(root.id);
    go('Level 1. ' + root.title);
  }
  function choose(i) {
    const n = node(cur().id), e = n.next[i];
    S.path.push({ id: e[0], via: { label: e[1], why: e[2] } }); mark(e[0]);
    S.view = 'node'; go('Level ' + node(e[0]).level + '. ' + node(e[0]).title);
  }
  function jump(i) { S.path = S.path.slice(0, i + 1); S.view = 'node'; closeTrail(); go('Returned to ' + node(cur().id).title); }
  function branch(i, id) {
    const e = node(S.path[i].id).next.find((x) => x[0] === id);
    S.path = S.path.slice(0, i + 1).concat([{ id, via: { label: e[1], why: e[2] } }]); mark(id);
    S.view = 'node'; closeTrail(); go('Branch: ' + node(id).title);
  }
  function finish() { S.view = 'summary'; closeTrail(); go('Research record'); }
  function restart() { S = { view: 'intro', qid: null, path: [], seen: S.seen }; closeTrail(); go('Choose a question'); }

  function go(announce) {
    save();
    const doRender = () => { render(); view.classList.remove('leaving'); if (!reduce) { view.classList.add('entering'); setTimeout(() => view.classList.remove('entering'), 40); } view.focus({ preventScroll: true }); if (scrollY > exp.offsetTop) scrollTo(0, exp.offsetTop); live.textContent = announce || ''; };
    setDepth();
    if (reduce) doRender(); else { view.classList.add('leaving'); setTimeout(doRender, 380); }
  }

  /* ---------- the descent ---------- */
  function setDepth() {
    const lvl = S.view === 'intro' ? 0 : S.view === 'summary' ? 4 : node(cur().id).level;
    const d = DEPTH[lvl];
    exp.style.setProperty('--d', lvl); exp.style.setProperty('--ox', d[0] + '%'); exp.style.setProperty('--oy', d[1] + '%');
    exp.dataset.depth = lvl; exp.dataset.view = S.view;
    document.querySelectorAll('#gauge li').forEach((li) => { const l = +li.dataset.l; li.className = l === lvl ? 'on' : l < lvl ? 'past' : ''; if (l === 4 && lvl === 4) li.classList.add('lit'); });
    aliceLine.textContent = S.view === 'summary' ? ALICE_END : ALICE[lvl];
    $('#btn-restart').hidden = S.view === 'intro';
    $('#trail-count').textContent = S.path.length;
  }

  /* ---------- views ---------- */
  function render() {
    $('#trail-count').textContent = S.path.length;
    if (!$('#trail').hidden) renderTrail();
    if (S.view === 'intro') return renderIntro();
    if (S.view === 'summary') return renderSummary();
    renderNode();
  }

  function renderIntro() {
    const resume = S.path.length ? '<div class="row resume"><button class="btn primary" data-act="resume">Resume “' + esc(qOf(S.qid).title) + '”</button></div>' : '';
    view.innerHTML =
      '<h1 class="title"><small>The Institute of Unnecessary Research</small>Investigation 11<br>Rabbit Hole</h1>' +
      '<p class="motto">Advancing Knowledge Sideways</p>' +
      '<p class="lede">Every answer opens a deeper question. Choose a question and descend through four levels of the archive. Your route is kept as a Research Trail.</p>' +
      resume +
      '<ol class="doors" aria-label="Starting questions">' + RH.questions.map((q, i) =>
        '<li><button class="door" data-q="' + q.id + '"><span class="n">' + (i + 1) + '</span><span class="q">' + esc(q.title) + '</span><span class="go" aria-hidden="true">→</span><span class="b">' + esc(q.blurb) + '</span></button></li>').join('') + '</ol>';
  }

  function crumbs() {
    const q = qOf(S.qid);
    return '<p class="crumbs" aria-label="Route so far"><span>' + esc(q.title) + '</span>' + S.path.map((p, i) =>
      '<span class="sep" aria-hidden="true">›</span>' + (i === S.path.length - 1 ? '<span aria-current="step">' + esc(node(p.id).title) + '</span>' : '<button data-jump="' + i + '">' + esc(node(p.id).title) + '</button>')).join('') + '</p>';
  }

  function renderNode() {
    const st = cur(), n = node(st.id), seen = S.seen[S.qid] || [];
    const conn = st.via ? '<p class="conn"><b>Connection</b>' + esc(st.via.why) + '</p>' : '';
    const srcs = '<details class="srcs"><summary>Sources (' + n.src.length + ')</summary><ul>' + n.src.map((k) => '<li>' + esc(RH.sources[k]) + '</li>').join('') + '</ul></details>';
    let next;
    if (n.next.length) {
      next = '<h2 class="next-h">Where does this lead?</h2><ul class="choices">' + n.next.map((e, i) =>
        '<li><button class="choice" data-c="' + i + '"><span>' + esc(e[1]) + '</span>' + (seen.includes(e[0]) ? '<span class="seen">explored</span>' : '') + '<span class="arrow" aria-hidden="true">↓</span></button></li>').join('') + '</ul>' +
        '<div class="row"><button class="btn" data-act="finish">Conclude here</button></div>';
    } else {
      const parent = S.path.length > 1 ? S.path.length - 2 : null;
      next = '<p class="bottom-note">This is the lowest floor of this pathway. The entry above is as specialized as the archive gets here.</p>' +
        '<div class="row"><button class="btn primary" data-act="finish">Complete my Research Trail</button>' +
        (parent !== null ? '<button class="btn" data-jump="' + parent + '">Take another branch</button>' : '') +
        '<button class="btn" data-act="restart">Another question</button></div>';
    }
    view.innerHTML = crumbs() +
      '<p class="lvl">Level ' + n.level + ' of 4 · ' + RH.levelNames[n.level] + '</p>' +
      '<h2 class="node-title">' + esc(n.title) + '</h2>' + conn +
      '<p class="body">' + esc(n.body) + '</p>' + srcs + next;
  }

  /* ---------- trail & summary ---------- */
  function renderTrail() {
    const body = $('#trail-body'), q = qOf(S.qid);
    if (!q) { body.innerHTML = '<p class="t-empty">No research yet. Choose a question to begin your trail.</p>'; return; }
    const seen = S.seen[S.qid] || [];
    body.innerHTML = '<p class="t-empty">Original question: <b>' + esc(q.title) + '</b>. Select a step to return to it. Choosing a different direction from there replaces the later steps.</p><ol>' +
      S.path.map((p, i) => {
        const n = node(p.id);
        const alts = n.next.filter((e) => seen.includes(e[0]) && !(S.path[i + 1] && S.path[i + 1].id === e[0]));
        return '<li class="t-step' + (i === S.path.length - 1 ? ' cur' : '') + '"><span class="lv">Level ' + n.level + '</span><button class="jump" data-jump="' + i + '">' + esc(n.title) + '</button>' +
          (p.via ? '<p class="why">' + esc(p.via.why) + '</p>' : '') +
          (alts.length ? '<p class="t-alt">Also explored from here:' + alts.map((e) => '<button data-branch="' + i + ':' + e[0] + '">' + esc(node(e[0]).title) + '</button>').join(' ·') + '</p>' : '') + '</li>';
      }).join('') + '</ol>' +
      (S.view !== 'summary' ? '<div class="row"><button class="btn primary" data-act="finish">View final summary</button></div>' : '');
  }

  function usedSources() { const ks = []; S.path.forEach((p) => node(p.id).src.forEach((k) => { if (!ks.includes(k)) ks.push(k); })); return ks; }
  function renderSummary() {
    const q = qOf(S.qid), last = node(cur().id), nexp = (S.seen[S.qid] || []).length, srcs = usedSources();
    view.innerHTML = '<p class="lvl">Research record</p><h2 class="node-title">' + esc(q.title) + '</h2>' +
      '<p class="body">You began with this question and descended ' + (S.path.length - 1) + ' level' + (S.path.length - 1 === 1 ? '' : 's') + ', ending at <b>' + esc(last.title) + '</b> on the ' + RH.levelNames[last.level] + '.</p>' +
      '<div class="stat"><span><b>' + S.path.length + '</b>entries</span><span><b>' + nexp + '</b>explored in this question</span><span><b>' + srcs.length + '</b>sources</span></div>' +
      '<ol class="rec">' + S.path.map((p) => { const n = node(p.id); return '<li><span class="lv">Level ' + n.level + ' · ' + RH.levelNames[n.level] + '</span><h3>' + esc(n.title) + '</h3>' + (p.via ? '<p class="why">' + esc(p.via.why) + '</p>' : '') + '</li>'; }).join('') + '</ol>' +
      '<details class="srcs"><summary>Sources for this trail (' + srcs.length + ')</summary><ul>' + srcs.map((k) => '<li>' + esc(RH.sources[k]) + '</li>').join('') + '</ul></details>' +
      '<div class="row"><button class="btn primary" data-act="copy">Copy trail</button><button class="btn" data-act="download">Download .txt</button><button class="btn" data-act="print">Print</button></div>' +
      '<p class="toast" id="toast" role="status"></p>' +
      '<div class="row"><button class="btn" data-jump="' + (S.path.length - 1) + '">Back to the last entry</button><button class="btn" data-jump="' + Math.max(0, S.path.length - 2) + '">Explore an alternative branch</button><button class="btn" data-act="restart">Another question</button></div>';
  }

  function trailText() {
    const q = qOf(S.qid), L = ['INVESTIGATION 11 — RABBIT HOLE', 'The Institute of Unnecessary Research · Advancing Knowledge Sideways', '', 'Original question: ' + q.title, ''];
    S.path.forEach((p, i) => { const n = node(p.id); L.push((i + 1) + '. [Level ' + n.level + ' · ' + RH.levelNames[n.level] + '] ' + n.title); if (p.via) L.push('   Connection: ' + p.via.why); L.push('   ' + n.body, ''); });
    L.push('Sources:'); usedSources().forEach((k) => L.push('- ' + RH.sources[k]));
    L.push('', 'Generated from curated, deterministic content. No live AI was used. Source references have not been independently verified.');
    return L.join('\n');
  }
  function toast(m) { const t = $('#toast'); if (t) t.textContent = m; live.textContent = m; }
  async function copy() {
    const txt = trailText();
    try { await navigator.clipboard.writeText(txt); toast('Trail copied to clipboard.'); }
    catch (e) { const ta = document.createElement('textarea'); ta.value = txt; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (x) {} ta.remove(); toast(ok ? 'Trail copied to clipboard.' : 'Copy unavailable. Use Download instead.'); }
  }
  function download() {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([trailText()], { type: 'text/plain' }));
    a.download = 'rabbit-hole-research-trail.txt'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('Trail downloaded.');
  }

  /* ---------- drawer ---------- */
  let lastFocus;
  function openTrail() { lastFocus = document.activeElement; $('#trail').hidden = false; $('#btn-trail').setAttribute('aria-expanded', 'true'); renderTrail(); $('#trail-close').focus(); }
  function closeTrail() { if ($('#trail').hidden) return; $('#trail').hidden = true; $('#btn-trail').setAttribute('aria-expanded', 'false'); }
  $('#btn-trail').addEventListener('click', () => ($('#trail').hidden ? openTrail() : closeTrail()));
  $('#trail-close').addEventListener('click', () => { closeTrail(); $('#btn-trail').focus(); });
  $('#btn-restart').addEventListener('click', restart);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#trail').hidden) { closeTrail(); $('#btn-trail').focus(); } });

  /* ---------- delegated clicks ---------- */
  exp.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.q) return start(t.dataset.q);
    if (t.dataset.c !== undefined) return choose(+t.dataset.c);
    if (t.dataset.jump !== undefined) return jump(+t.dataset.jump);
    if (t.dataset.branch) { const [i, id] = t.dataset.branch.split(':'); return branch(+i, id); }
    const a = t.dataset.act;
    if (a === 'finish') finish(); else if (a === 'restart') restart(); else if (a === 'copy') copy(); else if (a === 'download') download(); else if (a === 'print') print();
    else if (a === 'resume') { S.view = 'node'; go('Resumed'); }
  });

  /* ---------- Research Note: sources list ---------- */
  const ks = Object.keys(RH.sources).sort((a, b) => RH.sources[a].localeCompare(RH.sources[b]));
  $('#src-count').textContent = ks.length;
  $('#src-list').innerHTML = ks.map((k) => '<li>' + esc(RH.sources[k]) + '</li>').join('');

  const note = $('#research-note'), gauge = $('#gauge');
  const onScroll = () => { gauge.style.visibility = note.getBoundingClientRect().top < innerHeight * 0.6 ? 'hidden' : 'visible'; };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- boot ---------- */
  if (S.view === 'node' && !S.path.length) S.view = 'intro';
  if (S.view === 'summary' && !S.path.length) S.view = 'intro';
  setDepth(); render();
  window.RHApp = { state: () => S, start, choose, jump, branch, finish, restart, trailText };
})();
