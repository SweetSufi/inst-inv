/* Investigation 13 — deterministic structured-critique engine.
   No network, no LLM. Authored text (js/claims.js) is selected by state. */
(function () {
  'use strict';
  var CLAIMS = window.IUR.Claims;

  var TYPES = {
    assumption: { label: 'Question the assumption' },
    evidence: { label: 'Request evidence' },
    alternative: { label: 'Consider an alternative' }
  };
  // [kind, weight] for each finding a tier can reveal. Same structure for every claim.
  var SCHEMA = {
    assumption: [[['assumption', 6], ['missing', 8]], [['assumption', 6]], [['assumption', 5], ['missing', 7]]],
    evidence: [[['missing', 9]], [['evidence', 10]], [['evidence', 6], ['evidence', 6]]],
    alternative: [[['alternative', 6]], [['alternative', 0]], [['alternative', 3]]]
  };
  var DEFAULT_P = {
    assumption: ['What are you assuming?', 'What else are you assuming?', 'Are you assuming it is true because people keep repeating it?'],
    evidence: ['What evidence supports that?'],
    alternative: ['Could there be another explanation for why people believe it?', 'Is any part of the claim true?']
  };

  // Build tier definitions and item table for one claim.
  function build(claim) {
    var items = {}, tiers = {};
    Object.keys(TYPES).forEach(function (type) {
      tiers[type] = claim[type].map(function (t, n) {
        var ids = t[2].map(function (text, i) {
          var id = type + n + '_' + i, sc = SCHEMA[type][n][i];
          items[id] = { kind: sc[0], w: sc[1], text: text };
          return id;
        });
        var sound = type === 'alternative' && n > 0 ? 'steady' : 'uncertainty';
        return { prompt: t[0] || (DEFAULT_P[type][n]), lines: t[1], finds: ids, sadie: t[3], card: t[4], extras: t[5] || [], bonus: t[6] || [], sound: sound };
      });
    });
    return { items: items, tiers: tiers };
  }

  function State(claim) {
    this.claim = claim || CLAIMS[0];
    var b = build(this.claim);
    this.items = b.items; this.tiers = b.tiers;
    this.confidence = this.claim.conf;
    this.asked = []; this.found = {}; this.order = [];
    this.lastDrop = 0; this.concluded = false; this._report = null;
  }
  State.prototype.hasAsked = function (key) {
    var p = key.split('.');
    return this.asked.some(function (a) { return a.type === p[0] && a.tier === +p[1]; });
  };
  State.prototype.tierOf = function (type) {
    var n = 0; for (var i = 0; i < this.asked.length; i++) if (this.asked[i].type === type) n++; return n;
  };
  State.prototype.typesCovered = function () {
    var c = {}; this.asked.forEach(function (a) { c[a.type] = 1; }); return Object.keys(c);
  };
  State.prototype.available = function (type) { return this.tierOf(type) < this.tiers[type].length; };
  State.prototype.nextPrompt = function (type) {
    var t = this.tierOf(type); return t < this.tiers[type].length ? this.tiers[type][t].prompt : null;
  };
  State.prototype.canConclude = function () { return this.asked.length >= 2 && !this.concluded; };
  State.prototype.shouldOfferConclusion = function () {
    var all = Object.keys(TYPES).every(function (t) { return !this.available(t); }, this);
    return this.confidence <= 35 || all;
  };

  State.prototype.ask = function (type) {
    if (!TYPES[type] || this.concluded || !this.available(type)) return null;
    var self = this, tier = this.tierOf(type), def = this.tiers[type][tier];
    var lines = def.lines.slice();
    def.extras.forEach(function (x) { if (self.hasAsked(x[0])) lines.push(x[1]); });
    lines = lines.map(function (l) { return typeof l === 'string' ? { who: 'tobor', text: l } : l; });
    var drop = 0, newIds = [];
    def.finds.forEach(function (id) {
      if (!this.found[id]) { this.found[id] = true; this.order.push(id); newIds.push(id); drop += this.items[id].w; }
    }, this);
    def.bonus.forEach(function (b) { if (self.hasAsked(b[0])) drop += b[1]; });
    var before = this.confidence;
    this.confidence = Math.max(8, Math.round((this.confidence - drop) * 10) / 10);
    this.lastDrop = Math.round((before - this.confidence) * 10) / 10;
    this.asked.push({ type: type, tier: tier, prompt: def.prompt });
    return {
      type: type, tier: tier, prompt: def.prompt, lines: lines, sadie: def.sadie, card: def.card, cardNo: this.asked.length + 1,
      sound: def.sound, newIds: newIds, drop: this.lastDrop, confidence: this.confidence, before: before
    };
  };

  State.prototype.outcome = function () {
    return this.typesCovered().length === 3 ? 'Original claim withdrawn.' : 'Certainty temporarily unavailable.';
  };

  State.prototype.conclude = function () {
    if (!this.canConclude()) return null;
    this.concluded = true;
    var self = this, c = this.claim, byKind = function (k) {
      return self.order.filter(function (id) { return self.items[id].kind === k; }).map(function (id) { return self.items[id].text; });
    };
    var covered = this.typesCovered();
    var notExamined = Object.keys(TYPES).filter(function (t) { return covered.indexOf(t) < 0; }).map(function (t) { return TYPES[t].label; });
    var haveEvidence = byKind('evidence').length > 0;
    var revised = c.revised + ' ' + (haveEvidence ? c.revisedEv : 'This investigation did not examine the contradicting evidence directly, so the claim is withdrawn here as unsupported, and the widely accepted position is that it is a myth.');
    var did;
    if (covered.length === 3) did = 'Three different kinds of question exposed the hidden assumptions, the missing support, and the reasons the claim persists. TOBOR revised his conclusion once the claim could not be defended. Revising an unsupported conclusion is the intended outcome.';
    else did = 'Your questions exposed part of the problem, enough to remove TOBOR’s certainty. Not every angle was examined (' + notExamined.join('; ').toLowerCase() + '), so some weaknesses and some supporting context remain unexplored. Try a different pathway to compare.';
    return this._report = {
      outcome: this.outcome(),
      card: c.revisedCard + (covered.length === 3 ? ' Original claim withdrawn.' : ' Original claim set aside pending further questioning.'),
      claim: c.text, confidence: this.confidence,
      questions: this.asked.map(function (a) { return { label: TYPES[a.type].label, prompt: a.prompt }; }),
      assumptions: byKind('assumption'), evidence: byKind('evidence'), missing: byKind('missing'), alternatives: byKind('alternative'),
      notExamined: notExamined, revised: revised, did: did
    };
  };

  State.prototype.reportText = function (r) {
    r = r || this._report || this.conclude() || null;
    if (!r) return '';
    var L = [];
    var list = function (title, arr, empty) {
      L.push('', title.toUpperCase());
      if (!arr.length) L.push('- ' + empty); else arr.forEach(function (x, i) { L.push((i + 1) + '. ' + x); });
    };
    L.push('THE INSTITUTE OF UNNECESSARY RESEARCH', 'Department of Questionable Certainty', 'Case No. 013 — Case Findings', '');
    L.push('OUTCOME: ' + r.outcome);
    L.push('', 'ORIGINAL CLAIM', '"' + r.claim + '"');
    list('Questions asked by Sadie', r.questions.map(function (q) { return q.label + ': "' + q.prompt + '"'; }), 'None');
    list('Assumptions identified', r.assumptions, 'None identified');
    list('Evidence considered', r.evidence, 'None examined in this pathway');
    list('Missing or inadequate evidence', r.missing, 'None identified');
    list('Alternative explanations', r.alternatives, 'None examined');
    L.push('', 'REVISED CONCLUSION', r.revised);
    L.push('', 'WHAT THE QUESTIONING ACCOMPLISHED', r.did);
    L.push('', 'Note: TOBOR’s confidence (' + r.confidence.toFixed(1) + '%) is a fictional character attribute, not a calibrated probability. This investigation uses scripted, rule-based logic, not live AI.');
    return L.join('\n');
  };

  window.IUR = window.IUR || {};
  window.IUR.Investigation = { CLAIMS: CLAIMS, TYPES: TYPES, State: State };
})();
