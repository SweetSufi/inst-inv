/* TOBOR's electronic voice — Web Audio synthesis, local only.
   Muted by default; context is created only after a user gesture. */
(function () {
  'use strict';
  var ctx = null, master = null, enabled = false, active = [], token = 0;
  var MASTER = 0.16;

  function ensure() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = MASTER;
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 3200;
      master.connect(lp); lp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }

  // One tone with a soft envelope. Returns end time.
  function tone(freq, start, dur, opts) {
    opts = opts || {};
    var t0 = ctx.currentTime + start, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = opts.type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (opts.to) o.frequency.exponentialRampToValueAtTime(opts.to, t0 + dur);
    if (opts.vibrato) {
      var lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = opts.vibrato; lg.gain.value = freq * 0.06;
      lfo.connect(lg); lg.connect(o.frequency); lfo.start(t0); lfo.stop(t0 + dur + 0.05);
      active.push(lfo);
    }
    var peak = opts.vol || 0.5;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.05);
    active.push(o);
  }

  function play(fn) {
    if (!enabled || !ensure()) return;
    stop(true);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(MASTER, ctx.currentTime);
    fn();
  }

  function stop(keepEnabled) {
    if (!ctx) return;
    token++;
    var t = ctx.currentTime;
    try { master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(0.0001, t + 0.04); } catch (e) {}
    var old = active; active = [];
    old.forEach(function (o) { try { o.stop(t + 0.05); } catch (e) {} });
    if (keepEnabled) setTimeout(function () { try { master.gain.setValueAtTime(MASTER, ctx.currentTime); } catch (e) {} }, 60);
  }

  var Sounds = {
    activation: function () { tone(440, 0, 0.16, { type: 'triangle' }); tone(660, 0.2, 0.2, { type: 'triangle' }); },           // ~0.4s
    chirps: function () { [523, 622, 740].forEach(function (f, i) { tone(f, i * 0.2, 0.13, { type: 'triangle', to: f * 1.12, vol: 0.45 }); }); }, // ~0.6s
    processing: function () { tone(330, 0, 1.0, { type: 'sine', vibrato: 7, vol: 0.28 }); tone(495, 0.05, 0.95, { type: 'triangle', vibrato: 5.5, vol: 0.1 }); }, // ~1.0s
    uncertainty: function () { tone(520, 0, 0.5, { type: 'sine', to: 240, vol: 0.5 }); },                                       // ~0.5s
    revision: function () { [523, 440, 349].forEach(function (f, i) { tone(f, i * 0.22, 0.26, { type: 'sine', vol: 0.45 }); }); }, // ~0.7s
    chime: function () { tone(784, 0, 1.0, { type: 'sine', vol: 0.4 }); tone(1175, 0.02, 0.9, { type: 'sine', vol: 0.14 }); tone(523, 0, 0.9, { type: 'triangle', vol: 0.12 }); },   // ~1s
    click: function () { tone(1100, 0, 0.035, { type: 'triangle', to: 700, vol: 0.4 }); tone(180, 0, 0.05, { type: 'sine', vol: 0.4 }); }
  };

  window.IUR = window.IUR || {};
  window.IUR.Audio = {
    isEnabled: function () { return enabled; },
    // Must be called from a user gesture.
    setEnabled: function (on) {
      enabled = !!on;
      if (enabled) { ensure(); } else { stop(false); }
      return enabled;
    },
    stop: function () { stop(false); },
    play: function (name) { var f = Sounds[name]; if (f) play(f); },
    durations: { activation: 400, chirps: 600, processing: 1000, uncertainty: 500, revision: 700, chime: 1000 }
  };
})();
