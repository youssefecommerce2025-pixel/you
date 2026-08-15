// Pixels Meta (Facebook) et TikTok — charges UNIQUEMENT apres consentement cookies "ads".
//
// Depend de /cookies.js (window.cookieConsent + evenement cookie-consent-updated)
// et de /api/config (metaPixelId, tiktokPixelId).
//
// API : window.adPixels.track(eventName, params, { eventID })
//   - Lead, InitiateCheckout, Contact, PageView
//   File d'attente si le pixel n'est pas encore pret.

(function () {
  var metaId = "";
  var tiktokId = "";
  var metaReady = false;
  var tiktokReady = false;
  var enabled = false;
  var queue = [];

  function cookieGet(name) {
    try {
      var m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"));
      return m ? decodeURIComponent(m[1]) : "";
    } catch (e) {
      return "";
    }
  }

  function adsConsentGranted() {
    var c = window.cookieConsent && window.cookieConsent.get && window.cookieConsent.get();
    return !!(c && c.ads);
  }

  function initMeta() {
    if (!metaId || window.fbq) {
      if (window.fbq) metaReady = true;
      return Promise.resolve();
    }
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e); t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("consent", "grant");
    window.fbq("init", metaId);
    window.fbq("track", "PageView");
    metaReady = true;
    return Promise.resolve();
  }

  function initTiktok() {
    if (!tiktokId || window.ttq) {
      if (window.ttq) tiktokReady = true;
      return Promise.resolve();
    }
    !function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = w[t] = w[t] || [];
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
      ttq.setAndDefer = function (t, e) {
        t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); };
      };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (e) {
        var n = ttq._i[e] || [];
        for (var o = 0; o < ttq.methods.length; o++) ttq.setAndDefer(n, ttq.methods[o]);
        return n;
      };
      ttq.load = function (e, n) {
        var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i = ttq._i || {};
        ttq._i[e] = [];
        ttq._i[e]._u = r;
        ttq._t = ttq._t || {};
        ttq._t[e] = +new Date();
        ttq._o = ttq._o || {};
        ttq._o[e] = n || {};
        var a = document.createElement("script");
        a.type = "text/javascript";
        a.async = true;
        a.src = r + "?sdkid=" + e + "&lib=" + t;
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(a, s);
      };
    }(window, document, "ttq");
    window.ttq.load(tiktokId);
    window.ttq.page();
    tiktokReady = true;
    return Promise.resolve();
  }

  function enable() {
    if (enabled) {
      flush();
      return;
    }
    if (!metaId && !tiktokId) return;
    enabled = true;
    Promise.all([initMeta(), initTiktok()]).then(flush).catch(function () {
      flush();
    });
  }

  function disable() {
    enabled = false;
    try { if (window.fbq) window.fbq("consent", "revoke"); } catch (e) {}
    try { if (window.ttq && window.ttq.revokeConsent) window.ttq.revokeConsent(); } catch (e) {}
  }

  function mapTiktokEvent(name) {
    if (name === "Lead") return "SubmitForm";
    if (name === "InitiateCheckout") return "InitiateCheckout";
    if (name === "Contact") return "Contact";
    if (name === "PageView") return "Pageview";
    return name;
  }

  function fire(name, params, options) {
    var eventID = (options && options.eventID) || "";
    var payload = params || {};
    try {
      if (window.fbq && metaReady) {
        if (eventID) window.fbq("track", name, payload, { eventID: eventID });
        else window.fbq("track", name, payload);
      }
    } catch (e) {}
    try {
      if (window.ttq && tiktokReady) {
        var ttName = mapTiktokEvent(name);
        if (ttName === "Pageview") window.ttq.page();
        else window.ttq.track(ttName, payload);
      }
    } catch (e) {}
  }

  function flush() {
    if (!enabled) return;
    while (queue.length) {
      var item = queue.shift();
      fire(item.name, item.params, item.options);
    }
  }

  function track(name, params, options) {
    if (!adsConsentGranted()) return;
    if (!enabled || (!metaReady && !tiktokReady && (metaId || tiktokId))) {
      queue.push({ name: name, params: params, options: options });
      if (adsConsentGranted()) enable();
      return;
    }
    fire(name, params, options);
  }

  function newEventId() {
    try {
      if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    } catch (e) {}
    return "evt-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }

  function clickIds() {
    var params = new URLSearchParams(window.location.search);
    var fbclid = params.get("fbclid") || "";
    var fbc = cookieGet("_fbc");
    if (!fbc && fbclid) fbc = "fb.1." + Date.now() + "." + fbclid;
    return {
      fbp: cookieGet("_fbp") || "",
      fbc: fbc,
      ttp: cookieGet("_ttp") || "",
      ttclid: params.get("ttclid") || "",
    };
  }

  function maybeTrackThankYou() {
    if (!/\/merci\.html$/i.test(window.location.pathname)) return;
    if (!adsConsentGranted()) return;
    var params = new URLSearchParams(window.location.search);
    var eid = params.get("eid") || newEventId();
    track("Lead", { content_name: "devis_mutuelle", content_category: "mutuelle_sante" }, { eventID: eid });
  }

  function syncConsent(detail) {
    var ads = detail ? !!detail.ads : adsConsentGranted();
    if (ads) enable();
    else disable();
  }

  window.adPixels = {
    track: track,
    newEventId: newEventId,
    clickIds: clickIds,
    adsConsentGranted: adsConsentGranted,
  };

  document.addEventListener("cookie-consent-updated", function (e) {
    syncConsent(e.detail);
    maybeTrackThankYou();
  });

  function init() {
    fetch("/api/config")
      .then(function (r) { return r.json(); })
      .then(function (cfg) {
        metaId = (cfg && cfg.metaPixelId) || "";
        tiktokId = (cfg && cfg.tiktokPixelId) || "";
        syncConsent();
        maybeTrackThankYou();
      })
      .catch(function () {
        syncConsent();
      });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
