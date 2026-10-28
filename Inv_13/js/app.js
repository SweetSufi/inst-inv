(function () {
  'use strict';
  var I = window.IUR.Investigation, A = window.IUR.Audio, M = window.IUR.Anim;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var state, busy = false, timers = [], shownConf = 0, report = null, order = [], pos = 0;
  var KIND = { assumption: 'Assumption identified', missing: 'Missing evidence', evidence: 'Evidence', alternative: 'Alternative' };
  var log = $('#log');

  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function addMsg(who, text, delay) {
    var m = el('div', 'msg ' + who);
    var label = who === 'tobor' ? 'TOBOR' : who === 'sadie' ? 'Sadie' : 'What this reveals';
    m.appendChild(el('span', 'who', label));
    if (Array.isArray(text)) { var ul = el('ul'); ul.style.cssText = 'margin:0;padding-left:18px'; text.forEach(function (t) { ul.appendChild(el('li', '', t)); }); m.appendChild(ul); }
    else m.appendChild(el('p', '', text));
    if (delay) m.style.animationDelay = delay + 'ms';
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }

  function confStatus(e) {
    var c = state.confidence;
    if (e && e.drop === 0) return 'Holding steady';
    if (c >= 95) return 'Exaggerated';
    if (c >= 75) return 'Wavering slightly';
    if (c >= 50) return 'Reconsidering';
    return 'Certainty draining';
  }
  function setConf(to, status, dropped) {
    var from = shownConf; shownConf = to;
    M.tween(from, to, 900, function (v) {
      $('#confNum').textContent = v.toFixed(1);
      $('#fill').style.width = v + '%';
      $('#bar').setAttribute('aria-valuenow', v.toFixed(1));
    });
    $('#confStatus').textContent = status;
    if (dropped && !M.reduced()) { var m = $('#meter'); m.classList.remove('drop'); void m.offsetWidth; m.classList.add('drop'); }
  }

  function renderBoard() {
    $$('.bsec').forEach(function (sec) {
      var k = sec.dataset.k, ul = $('ul', sec), have = state.order.filter(function (id) { return state.items[id].kind === k; });
      var prev = ul.children.length && !ul.firstChild.classList.contains('empty') ? ul.children.length : 0;
      ul.textContent = '';
      if (!have.length) ul.appendChild(el('li', 'empty', 'None yet'));
      have.forEach(function (id, i) { var li = el('li', '', state.items[id].text); if (i < prev) li.style.animation = 'none'; ul.appendChild(li); });
    });
  }

  function renderChoices() {
    $$('.choice').forEach(function (b) {
      var t = b.dataset.type, n = state.tierOf(t), avail = state.available(t);
      b.classList.remove('selected');
      $('.c-q', b).textContent = avail ? '“' + state.nextPrompt(t) + '”' : 'Fully explored';
      $$('.pips i', b).forEach(function (p, i) { p.classList.toggle('on', i < n); });
      b.classList.toggle('done', !avail);
      b.disabled = !avail || state.concluded || busy;
      b.setAttribute('aria-label', I.TYPES[t].label + (avail ? '. Sadie asks: ' + state.nextPrompt(t) : '. Fully explored.') + ' Step ' + Math.min(n + 1, 3) + ' of 3.');
    });
    $('#choices').classList.toggle('busy', busy);
    var can = state.canConclude() && !busy;
    var cb = $('#concludeBtn');
    cb.disabled = !can;
    cb.classList.toggle('nudge', can && state.shouldOfferConclusion());
    $('#concludeHint').textContent = state.concluded ? 'Findings are open below.' : state.asked.length < 2 ? 'Ask at least two questions to open the findings.' : 'You can present findings now, or keep investigating.';
  }

  var cards = [];
  function showCard(i, anim) {
    var c = $('#claimCard'), k = cards[i];
    $('#claimLabel').textContent = k.label;
    $('#claimText').textContent = '“' + k.text + '”';
    $('#claimOrig').hidden = i === 0;
    $('#claimOrig').textContent = 'Original claim: “' + state.claim.text + '”';
    if (anim) { c.classList.remove('swap'); void c.offsetWidth; c.classList.add('swap'); }
    $$('#tray button').forEach(function (b, j) { b.setAttribute('aria-pressed', j === i); });
  }
  function setCard(text, no, label) {
    if (no === 1) cards = [];
    cards.push({ text: text, label: label || ('TOBOR’s evidence card No. ' + no) });
    var tray = $('#tray'); tray.textContent = '';
    tray.hidden = cards.length < 2;
    cards.forEach(function (k, j) {
      var b = el('button', 'tray-b', j === cards.length - 1 && label ? 'Revised' : String(j + 1));
      b.type = 'button'; b.setAttribute('aria-label', k.label);
      b.addEventListener('click', function () { showCard(j, true); });
      tray.appendChild(b);
    });
    showCard(cards.length - 1, true);
  }
  function addCardMsg(no, text, delay, label) {
    var m = el('div', 'msg cardmsg'); if (delay) m.style.animationDelay = delay + 'ms';
    m.appendChild(el('span', 'who', label || ('TOBOR places new evidence card No. ' + no)));
    m.appendChild(el('p', 'cardtxt', '“' + text + '”'));
    log.appendChild(m); log.scrollTop = log.scrollHeight;
  }

  function intro() {
    $('#claimNo').textContent = 'Claim ' + (pos + 1) + ' of ' + I.CLAIMS.length;
    setCard(state.claim.text, 1);
    addMsg('tobor', state.claim.intro);
    M.gesture();
    if (A.isEnabled()) later(function () { A.play('chirps'); }, 150);
  }

  function ask(type) {
    if (busy || state.concluded || !state.available(type)) return;
    busy = true;
    var btn = $('.choice[data-type="' + type + '"]');
    renderChoices(); btn.classList.add('selected'); $('#choices').classList.add('busy');
    A.play('click');
    var prompt = state.nextPrompt(type);
    addMsg('sadie', prompt);
    var proc = el('div', 'msg proc'); proc.innerHTML = 'TOBOR is processing<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>'; log.appendChild(proc); log.scrollTop = log.scrollHeight;
    $('#concludeHint').textContent = 'TOBOR is processing…';
    M.challenged(true); M.processing(true);
    later(function () { A.play('processing'); }, 120);
    later(function () {
      proc.remove(); M.processing(false);
      var e = state.ask(type);
      e.lines.forEach(function (l, i) { addMsg(l.who, l.text, i * 350); });
      M.gesture();
      setCard(e.card, e.cardNo + 0);
      addCardMsg(e.cardNo, e.card, e.lines.length * 350);
      if (e.sound === 'uncertainty') { M.uncertain(1600); A.play('uncertainty'); }
      later(function () { M.challenged(false); }, 1200);
      setConf(e.confidence, confStatus(e), e.drop > 0);
      renderBoard();
      var wait = 600 + e.lines.length * 350;
      later(function () {
        addMsg('note', e.newIds.map(function (id) { return KIND[state.items[id].kind] + ': ' + state.items[id].text; }));
        addMsg('sadie', e.sadie); M.sadieReact();
        if (state.shouldOfferConclusion()) addMsg('tobor', 'I find that I would like to revise something. Sadie, may we open the Case Findings?');
        busy = false; renderChoices();
        $('#concludeHint').textContent = 'You can present findings now, or keep investigating.';
        if (state.shouldOfferConclusion()) $('#concludeHint').textContent = 'TOBOR is ready to revise his conclusion.';
      }, wait);
    }, 1150);
    renderChoices(); btn.classList.add('selected');
  }

  function el2(t, c) { return el(t, c); }
  function section(title, content, wide) {
    var s = el('div', 'f-sec' + (wide ? ' wide' : '')); s.appendChild(el('h3', '', title));
    if (typeof content === 'string') s.appendChild(el('p', '', content));
    else s.appendChild(content);
    return s;
  }
  function listOf(arr, empty, ordered) {
    if (!arr.length) return el('p', 'none', empty);
    var l = el(ordered ? 'ol' : 'ul'); arr.forEach(function (x) { l.appendChild(el('li', '', x)); }); return l;
  }

  function conclude() {
    if (busy || !state.canConclude()) return;
    busy = true;
    report = state.conclude();
    renderChoices();
    var withdrawn = report.outcome.indexOf('withdrawn') > -1;
    A.play('click');
    later(function () {
      addMsg('tobor', withdrawn ? 'I withdraw the claim. I would like it noted that withdrawing it was my idea.' : 'My certainty is temporarily unavailable. Please do not take this as a retraction of my confidence in myself.');
      M.reconsider(1800); M.challenged(true); later(function () { M.challenged(false); }, 1400);
      A.play('revision');
      setCard(report.card, 0, 'Revised evidence card'); addCardMsg(0, report.card, 300, 'TOBOR places a revised evidence card');
      setConf(state.confidence, report.outcome, false);
    }, 150);
    later(function () {
      var f = $('#findings'); $('#outcome').textContent = report.outcome;
      var g = $('#fGrid'); g.textContent = '';
      g.appendChild(section('Original claim', '“' + report.claim + '”', true));
      g.appendChild(section('Questions asked by Sadie', listOf(report.questions.map(function (q) { return q.label + ': “' + q.prompt + '”'; }), 'None', true)));
      g.appendChild(section('Assumptions identified', listOf(report.assumptions, 'None identified in this pathway.')));
      g.appendChild(section('Evidence considered', listOf(report.evidence, 'None examined in this pathway.')));
      g.appendChild(section('Missing or inadequate evidence', listOf(report.missing, 'None identified in this pathway.')));
      g.appendChild(section('Alternative explanations', listOf(report.alternatives, 'None examined in this pathway.')));
      g.appendChild(section('Revised conclusion', report.revised, true));
      g.appendChild(section('What your questioning accomplished', report.did, true));
      f.hidden = false;
      A.play('chime');
      var h = $('#findTitle');
      window.scrollTo({ top: f.getBoundingClientRect().top + window.pageYOffset - 12, behavior: M.reduced() ? 'auto' : 'smooth' });
      h.focus({ preventScroll: true });
      busy = false; renderChoices();
      $('#concludeBtn').disabled = true;
    }, 1000);
  }

  function shuffle(n) {
    var r = [], i = 1; for (; i < n; i++) r.push(i);
    for (i = r.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = r[i]; r[i] = r[j]; r[j] = t; }
    return r;
  }
  function nextClaim() {
    pos++;
    if (pos >= I.CLAIMS.length) { order = [0].concat(shuffle(I.CLAIMS.length)); order = order.slice(1).concat(order.slice(0, 1)); pos = 0; }
    return I.CLAIMS[order[pos]];
  }
  function restart(newClaim) {
    clearTimers(); A.stop(); M.reset(); busy = false; report = null;
    state = new I.State(newClaim === true ? nextClaim() : state.claim); shownConf = state.claim.conf;
    log.textContent = ''; $('#findings').hidden = true; $('#copyMsg').textContent = '';
    var c0 = state.claim.conf.toFixed(1); $('#confNum').textContent = c0; $('#fill').style.width = c0 + '%'; $('#bar').setAttribute('aria-valuenow', c0); $('#confStatus').textContent = 'Exaggerated';
    renderBoard(); renderChoices(); M.entrance && M.gesture();
    document.getElementById('stage').classList.add('st-awake');
    intro();
    window.scrollTo({ top: $('#investigation').offsetTop - 8, behavior: M.reduced() ? 'auto' : 'smooth' });
    var c = $('.choice'); if (c) c.focus({ preventScroll: true });
  }

  function copyReport() {
    var txt = state.reportText(report), msg = $('#copyMsg');
    var ok = function () { msg.textContent = 'Report copied to the clipboard.'; };
    var fallback = function () {
      var ta = el('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? ok() : msg.textContent = 'Copy was blocked. Please use Download instead.'; } catch (e) { msg.textContent = 'Copy was blocked. Please use Download instead.'; }
      ta.remove();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(ok, fallback); else fallback();
  }
  function downloadReport() {
    var blob = new Blob([state.reportText(report)], { type: 'text/plain;charset=utf-8' });
    var a = el('a'); a.href = URL.createObjectURL(blob); a.download = 'case-013-findings.txt';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    $('#copyMsg').textContent = 'Report downloaded as case-013-findings.txt.';
  }

  function setSoundUI() {
    var on = A.isEnabled(), b = $('#soundBtn');
    b.setAttribute('aria-pressed', on); $('#soundLbl').textContent = on ? 'Sound on' : 'Sound off';
    try { sessionStorage.setItem('iur13-sound', on ? 'on' : 'off'); } catch (e) {}
  }
  function setMotionUI() {
    var p = M.isPaused(); $('#motionBtn').setAttribute('aria-pressed', p);
    $('#motionLbl').textContent = p ? 'Resume animation' : 'Pause animation';
  }

  function init() {
    order = [0].concat(shuffle(I.CLAIMS.length)); pos = 0;
    state = new I.State(I.CLAIMS[0]); shownConf = state.claim.conf;
    M.init(); setMotionUI();
    try { if (sessionStorage.getItem('iur13-sound') === 'on') { A.setEnabled(true); } } catch (e) {}
    setSoundUI();
    $$('.choice').forEach(function (b) { b.addEventListener('click', function () { ask(b.dataset.type); }); });
    $('#concludeBtn').addEventListener('click', conclude);
    $('#restartBtn').addEventListener('click', function () { restart(false); });
    $('#restart2').addEventListener('click', function () { restart(true); });
    $('#copyBtn').addEventListener('click', copyReport);
    $('#dlBtn').addEventListener('click', downloadReport);
    $('#soundBtn').addEventListener('click', function () {
      var on = !A.isEnabled(); A.setEnabled(on); setSoundUI();
      if (on) { A.play('activation'); document.getElementById('stage').classList.add('st-awake'); M.gesture(); later(function () { A.play('chirps'); }, 600); }
      else clearTimers();
    });
    $('#motionBtn').addEventListener('click', function () { M.setPaused(!M.isPaused()); setMotionUI(); });
    renderBoard(); renderChoices();
    M.entrance(function () {});
    later(intro, 0);
    // Test hook (read-only inspection)
    window.IUR.debug = { get state() { return state; } };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
