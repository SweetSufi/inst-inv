/* Animation controller: sets state classes on #stage, handles motion preference. */
(function () {
  'use strict';
  var stage, timers = [], reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var paused = false;

  function svgs() { return document.querySelectorAll('.o-screen'); }
  function applyPause() {
    document.body.classList.toggle('motion-off', paused);
    svgs().forEach(function (s) { try { paused ? s.pauseAnimations() : s.unpauseAnimations(); } catch (e) {} });
  }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function set(cls, on) { if (stage) stage.classList.toggle(cls, on); }
  function pulse(cls, ms) {
    set(cls, false); void stage.offsetWidth; set(cls, true);
    later(function () { set(cls, false); }, ms);
  }

  window.IUR = window.IUR || {};
  window.IUR.Anim = {
    init: function () {
      stage = document.getElementById('stage');
      var saved = null; try { saved = sessionStorage.getItem('iur13-motion'); } catch (e) {}
      paused = saved ? saved === 'paused' : reduce;
      applyPause();
    },
    isPaused: function () { return paused; },
    reduced: function () { return reduce || paused; },
    setPaused: function (p) { paused = !!p; try { sessionStorage.setItem('iur13-motion', paused ? 'paused' : 'on'); } catch (e) {} applyPause(); },
    // 0-1s lab alive; 1-2s antenna wakes; 2-3s Sadie looks at the card
    entrance: function (onAntenna) {
      later(function () { set('st-awake', true); if (onAntenna) onAntenna(); }, 1000);
      later(function () { pulse('st-glint', 1300); pulse('st-gesture', 1900); }, 2000);
    },
    processing: function (on) { set('st-processing', on); if (on) { set('st-uncertain', false); set('st-reconsider', false); } },
    challenged: function (on) { set('st-challenged', on); },
    gesture: function () { pulse('st-gesture', 1900); },
    sadieReact: function () { pulse('st-glint', 1300); },
    uncertain: function (ms) { set('st-uncertain', true); later(function () { set('st-uncertain', false); }, ms || 1600); },
    reconsider: function (ms) { set('st-reconsider', true); later(function () { set('st-reconsider', false); }, ms || 1800); },
    reset: function () { timers.forEach(clearTimeout); timers = []; ['st-processing', 'st-uncertain', 'st-reconsider', 'st-challenged', 'st-gesture', 'st-glint'].forEach(function (c) { set(c, false); }); },
    tween: function (from, to, ms, cb) {
      if (window.IUR.Anim.reduced()) { cb(to); return; }
      var t0 = performance.now();
      (function step(t) {
        var p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 3);
        cb(from + (to - from) * e);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }
  };
})();
