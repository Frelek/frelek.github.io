/* Kacper Frelek, personal site: routing, lightbox, calculators, launch intro. */
(function () {
  "use strict";

  var LANG = (document.documentElement.lang || "en").slice(0, 2);
  var T = {
    en: {
      laminar: "laminar", turbulent: "turbulent",
      cfLam: "Laminar boundary layer, so c_f and δ come from the Blasius flat-plate solution.",
      cfTurb: "Turbulent boundary layer, assumed turbulent from the leading edge: c_f and δ come from Prandtl's one-seventh power law, which holds up to roughly Re = 10⁷.",
      showTable: "Show atmosphere table", hideTable: "Hide atmosphere table",
      earthTable: "US Standard Atmosphere 1976", marsTable: "Mars atmosphere (NASA Glenn model)",
      waterRow: "Water at 20 °C: ρ = 998.2 kg/m³, ν = 1.004 × 10⁻⁶ m²/s, independent of altitude.",
      t5Hint: "Mach number and altitude are fixed by the tunnel condition: V = 3,367 m/s, ρ = 0.03116 kg/m³, T = 1,828 K, h₀ = 10.6 MJ/kg, giving M ≈ 5.0.",
      noDissHint: "The Lewis number and the dissociation enthalpy ratio are only used by the other three options.",
      highMach: "Above roughly M 10 the perfect-gas shock relations overestimate the edge temperature badly; treat the result as an order of magnitude only.",
      dissFactor: "Dissociation factor",
      retained: "retained"
    },
    pl: {
      laminar: "laminarny", turbulent: "turbulentny",
      cfLam: "Warstwa laminarna, więc c_f i δ wynikają z rozwiązania Blasiusa dla płaskiej płyty.",
      cfTurb: "Warstwa turbulentna, przyjęta jako turbulentna od krawędzi natarcia: c_f i δ wynikają z prawa potęgowego 1/7 Prandtla, stosowalnego mniej więcej do Re = 10⁷.",
      showTable: "Pokaż tabelę atmosfery", hideTable: "Ukryj tabelę atmosfery",
      earthTable: "Atmosfera wzorcowa USA 1976", marsTable: "Atmosfera Marsa (model NASA Glenn)",
      waterRow: "Woda w 20 °C: ρ = 998,2 kg/m³, ν = 1,004 × 10⁻⁶ m²/s, niezależnie od wysokości.",
      t5Hint: "Liczba Macha i wysokość wynikają z warunków w tunelu: V = 3367 m/s, ρ = 0,03116 kg/m³, T = 1828 K, h₀ = 10,6 MJ/kg, co daje M ≈ 5,0.",
      noDissHint: "Liczba Lewisa i stosunek entalpii dysocjacji są używane tylko w pozostałych trzech wariantach.",
      highMach: "Powyżej ok. M 10 relacje dla gazu doskonałego mocno zawyżają temperaturę za falą; wynik traktuj tylko jako rząd wielkości.",
      dissFactor: "Współczynnik dysocjacji",
      retained: "zachowane"
    }
  }[LANG === "pl" ? "pl" : "en"];

  var $ = function (id) { return document.getElementById(id); };
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ number formatting */

  var SUP = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  function localise(s) { return LANG === "pl" ? s.replace(/\./g, ",") : s; }
  function sci(x, digits) {
    if (!isFinite(x)) return "–";
    if (x === 0) return "0";
    var e = Math.floor(Math.log10(Math.abs(x)));
    var m = x / Math.pow(10, e);
    if (Math.abs(m) >= 9.995) { m /= 10; e += 1; }
    var exp = String(e).split("").map(function (c) { return SUP[c]; }).join("");
    return localise(m.toFixed(digits === undefined ? 2 : digits)) + " × 10" + exp;
  }
  function num(x, dp) {
    if (!isFinite(x)) return "–";
    var s = x.toLocaleString(LANG === "pl" ? "pl-PL" : "en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp });
    return s;
  }
  function smart(x, sig) {
    if (!isFinite(x)) return "–";
    var a = Math.abs(x);
    if (a !== 0 && (a < 0.01 || a >= 1e5)) return sci(x, sig - 1);
    var dp = Math.max(0, sig - 1 - Math.floor(Math.log10(a || 1)));
    return num(x, dp);
  }

  /* ------------------------------------------------------------------ atmosphere models */

  // US Standard Atmosphere 1976 (geopotential altitude h, km) and the NASA Glenn Mars model.
  function earthAtm(z) {
    var T, p;
    if (z <= 11) { T = 288.15 - 6.5 * z; p = 101325 * Math.pow(T / 288.15, 5.2559); }
    else if (z <= 20) { T = 216.65; p = 22632.1 * Math.exp(-(z - 11) * 1000 / 6341.62); }
    else if (z <= 32) { T = 216.65 + 1.0 * (z - 20); p = 5474.89 * Math.pow(216.65 / T, 34.1632); }
    else if (z <= 47) { T = 228.65 + 2.8 * (z - 32); p = 868.019 * Math.pow(228.65 / T, 12.2011); }
    else if (z <= 51) { T = 270.65; p = 110.906 * Math.exp(-(z - 47) * 1000 / 7922.26); }
    else if (z <= 71) { T = 270.65 - 2.8 * (z - 51); p = 66.9389 * Math.pow(T / 270.65, 12.2011); }
    else { T = 214.65 - 2.0 * (z - 71); p = 3.95642 * Math.pow(T / 214.65, 17.0816); }
    return { T: T, p: p, R: 287.05, mu0: 1.716e-5, T0: 273.15, S: 110.4 };
  }
  function marsAtm(z) {
    var T = z <= 7 ? 242.15 - 0.998 * z : 249.75 - 2.22 * z;
    T = Math.max(T, 120);
    var p = 699 * Math.exp(-0.09 * z);
    return { T: T, p: p, R: 188.92, mu0: 1.370e-5, T0: 273.15, S: 222 };
  }
  function sutherland(gas, T) { return gas.mu0 * Math.pow(T / gas.T0, 1.5) * (gas.T0 + gas.S) / (T + gas.S); }
  function atmosphere(planet, z) {
    z = Math.max(0, Math.min(80, z || 0));
    // Earth model works in geopotential altitude; inputs are geometric altitude.
    var g = planet === "mars" ? marsAtm(z) : earthAtm(6356.766 * z / (6356.766 + z));
    var rho = g.p / (g.R * g.T), mu = sutherland(g, g.T);
    return { z: z, T: g.T, p: g.p, rho: rho, mu: mu, nu: mu / rho, gas: g };
  }

  /* ------------------------------------------------------------------ routing */

  var pages = Array.prototype.slice.call(document.querySelectorAll("main > .page"));
  var navMenu = $("navMenu");
  var navToggle = document.querySelector(".nav-toggle");
  var baseTitle = document.title;

  function closeMenus() {
    document.querySelectorAll(".has-menu.is-open").forEach(function (li) {
      li.classList.remove("is-open");
      var b = li.querySelector(".menu-toggle"); if (b) b.setAttribute("aria-expanded", "false");
    });
  }
  function closeMobileNav() {
    if (navMenu) navMenu.classList.remove("is-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  function show(id, scroll) {
    var target = pages.filter(function (p) { return p.id === id; })[0] || pages[0];
    pages.forEach(function (p) { p.classList.toggle("active", p === target); });

    document.querySelectorAll(".nav-item").forEach(function (li) {
      var direct = li.querySelector(":scope > .nav-link[data-target]");
      var inMenu = li.querySelector('.menu [data-target="' + target.id + '"]');
      li.classList.toggle("is-active", !!(direct && direct.getAttribute("data-target") === target.id) || !!inMenu);
    });
    document.querySelectorAll(".menu a").forEach(function (a) {
      if (a.getAttribute("data-target") === target.id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    var heading = target.querySelector("h1, h2");
    document.title = target.id === "overview" || !heading ? baseTitle : heading.textContent.trim() + " · Kacper Frelek";

    closeMenus();
    closeMobileNav();
    if (scroll) window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    return target;
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest("[data-target]");
    if (!link) return;
    e.preventDefault();
    var id = link.getAttribute("data-target");
    if (location.hash !== "#" + id) history.pushState(null, "", "#" + id);
    show(id, true);
  });
  window.addEventListener("popstate", function () { show(location.hash.slice(1), false); });
  window.addEventListener("hashchange", function () { show(location.hash.slice(1), true); });
  show(location.hash.slice(1), false);

  document.querySelectorAll(".menu-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var li = btn.closest(".has-menu");
      var open = !li.classList.contains("is-open");
      closeMenus();
      li.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".has-menu")) closeMenus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeMenus(); closeMobileNav(); } });

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = !navMenu.classList.contains("is-open");
      navMenu.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Language switch keeps the current section.
  document.querySelectorAll(".lang-btn:not(.is-current)").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      location.href = a.getAttribute("href").split("#")[0] + (location.hash || "");
    });
  });

  /* ------------------------------------------------------------------ KaTeX */

  function renderMath() {
    if (typeof window.renderMathInElement !== "function") return false;
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option", "output"],
      throwOnError: false
    });
    return true;
  }
  if (!renderMath()) window.addEventListener("load", renderMath);

  /* ------------------------------------------------------------------ lightbox */

  var lb = $("lightbox"), lbFigure = $("lbFigure"), lbCaption = $("lbCaption");
  var lbImg = document.createElement("img");
  lbImg.alt = "";
  if (lbFigure) lbFigure.insertBefore(lbImg, lbCaption);
  var lbItems = [], lbIndex = 0, lbReturn = null;

  function lbShow(i) {
    lbIndex = (i + lbItems.length) % lbItems.length;
    var img = lbItems[lbIndex];
    lbImg.src = img.getAttribute("data-full") || img.currentSrc || img.src;
    lbImg.alt = img.alt;
    var cap = img.closest("figure").querySelector("figcaption");
    lbCaption.textContent = cap ? cap.textContent.trim() : img.alt;
  }
  function lbOpen(img) {
    var scope = img.closest(".page") || document;
    lbItems = Array.prototype.slice.call(scope.querySelectorAll(".zoomable:not([hidden]) img"));
    lbReturn = document.activeElement;
    lbShow(Math.max(0, lbItems.indexOf(img)));
    lb.hidden = false;
    document.documentElement.style.overflow = "hidden";
    $("lbClose").focus();
  }
  function lbClose() {
    lb.hidden = true;
    lbImg.removeAttribute("src");
    document.documentElement.style.overflow = "";
    if (lbReturn && lbReturn.focus) lbReturn.focus();
  }
  document.addEventListener("click", function (e) {
    var img = e.target.closest(".zoomable img");
    if (img) lbOpen(img);
  });
  document.querySelectorAll(".zoomable img").forEach(function (img) {
    img.tabIndex = 0;
    img.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); lbOpen(img); } });
  });
  if (lb) {
    $("lbClose").addEventListener("click", lbClose);
    $("lbPrev").addEventListener("click", function () { lbShow(lbIndex - 1); });
    $("lbNext").addEventListener("click", function () { lbShow(lbIndex + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lbClose(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") lbClose();
      else if (e.key === "ArrowLeft") lbShow(lbIndex - 1);
      else if (e.key === "ArrowRight") lbShow(lbIndex + 1);
    });
  }

  /* ------------------------------------------------------------------ calculator 1: y+ */

  var meshEls = ["meshVel", "meshChord", "meshTargetYPlus", "meshFluidSelect", "meshAlt"].map($);
  var meshState = { rho: 1.225, nu: 1.46e-5 };

  function updateFluid() {
    var planet = $("meshFluidSelect").value;
    var altField = $("meshAltGroup");
    if (planet === "water") {
      meshState = { rho: 998.2, nu: 1.004e-6 };
      altField.classList.add("is-off");
      $("meshAlt").disabled = true;
    } else {
      var a = atmosphere(planet, parseFloat($("meshAlt").value));
      meshState = { rho: a.rho, nu: a.nu };
      altField.classList.remove("is-off");
      $("meshAlt").disabled = false;
    }
    $("meshDensity").textContent = smart(meshState.rho, 4);
    $("meshNu").textContent = sci(meshState.nu, 3);
    renderAtmTable(planet);
  }

  function renderAtmTable(planet) {
    var body = $("atmTableBody");
    if (!body) return;
    $("atmTableTitle").textContent = planet === "mars" ? T.marsTable : T.earthTable;
    if (planet === "water") { body.innerHTML = '<tr><td colspan="6" style="text-align:left">' + T.waterRow + "</td></tr>"; return; }
    var zNow = parseFloat($("meshAlt").value) || 0;
    var rows = [0, 2, 5, 8, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80].map(function (z) {
      var a = atmosphere(planet, z);
      var cls = Math.abs(z - zNow) < 1.5 ? ' class="is-current"' : "";
      return "<tr" + cls + "><td>" + z + "</td><td>" + num(a.T, 1) + "</td><td>" + smart(a.p, 4) + "</td><td>" + smart(a.rho, 4) +
        "</td><td>" + num(a.mu * 1e6, 2) + "</td><td>" + sci(a.nu, 2) + "</td></tr>";
    });
    body.innerHTML = rows.join("");
  }

  function runMesh() {
    var U = Math.max(1e-3, parseFloat($("meshVel").value) || 0);
    var L = Math.max(1e-4, parseFloat($("meshChord").value) || 0);
    var yp = Math.max(1e-3, parseFloat($("meshTargetYPlus").value) || 0);
    var rho = meshState.rho, nu = meshState.nu;

    var Re = U * L / nu;
    var turb = Re >= 5e5;
    var cf = turb ? 0.0592 * Math.pow(Re, -0.2) : 0.664 / Math.sqrt(Re);
    var d99 = turb ? 0.37 * L * Math.pow(Re, -0.2) : 5.0 * L / Math.sqrt(Re);
    var tau = 0.5 * rho * U * U * cf;
    var utau = Math.sqrt(tau / rho);
    var dy = yp * nu / utau;

    $("resRe").textContent = sci(Re, 2) + " (" + (turb ? T.turbulent : T.laminar) + ")";
    $("resCf").textContent = sci(cf, 3);
    $("resFrictionVel").textContent = smart(tau, 3) + " Pa / " + smart(utau, 3) + " m/s";
    $("resBLThickness").textContent = d99 < 1 ? smart(d99 * 1000, 3) + " mm" : smart(d99, 3) + " m";
    $("resFirstCell").textContent = dy < 1e-3 ? smart(dy * 1e6, 3) + " μm" : smart(dy * 1000, 3) + " mm";
    $("cfOriginText").textContent = turb ? T.cfTurb : T.cfLam;
  }

  if ($("meshVel")) {
    meshEls.forEach(function (el) {
      el.addEventListener("input", function () { if (el.id === "meshFluidSelect" || el.id === "meshAlt") updateFluid(); runMesh(); });
      el.addEventListener("change", function () { if (el.id === "meshFluidSelect" || el.id === "meshAlt") updateFluid(); runMesh(); });
    });
    var tableBtn = $("btnToggleAtmTable");
    tableBtn.addEventListener("click", function () {
      var box = $("atmTableContainer");
      box.hidden = !box.hidden;
      tableBtn.setAttribute("aria-expanded", String(!box.hidden));
      tableBtn.textContent = box.hidden ? T.showTable : T.hideTable;
    });
    updateFluid();
    runMesh();
  }

  /* ------------------------------------------------------------------ calculator 2: Fay-Riddell */

  var frIds = ["calcGas", "calcMach", "calcAlt", "calcNoseRadius", "calcTw", "calcCatalysis", "calcLewis", "calcHd"];
  var lastCase = null;

  function setOff(id, off) {
    var el = $(id);
    el.disabled = off;
    el.closest(".field").classList.toggle("is-off", off);
  }

  function runFR() {
    var kase = $("calcGas").value;
    var isT5 = kase === "co2_t5", isMars = kase !== "air_earth";
    var model = $("calcCatalysis").value;

    if (kase !== lastCase) {
      // Sensible defaults when the case changes.
      if (isT5) { $("calcHd").value = "0.29"; $("calcNoseRadius").value = "0.04445"; $("calcTw").value = "300"; }
      else if (lastCase === "co2_t5") { $("calcHd").value = "0"; }
      lastCase = kase;
    }
    setOff("calcMach", isT5);
    setOff("calcAlt", isT5);
    setOff("calcLewis", model === "convective");
    setOff("calcHd", model === "convective");

    var gamma = isMars ? 1.30 : 1.40;
    var gas = isMars ? { R: 188.92, mu0: 1.370e-5, T0: 273.15, S: 222 } : { R: 287.05, mu0: 1.716e-5, T0: 273.15, S: 110.4 };
    var Pr = isMars ? 0.70 : 0.71;
    var cp = gamma / (gamma - 1) * gas.R;

    var Rn = Math.max(1e-4, parseFloat($("calcNoseRadius").value) || 0.04445);
    var Tw = Math.max(50, parseFloat($("calcTw").value) || 300);
    var Le = Math.max(0.1, parseFloat($("calcLewis").value) || 1);
    var hdRatio = Math.min(0.8, Math.max(0, parseFloat($("calcHd").value) || 0));

    var Tinf, pinf, rhoinf, Vinf, M, h0e;
    if (isT5) {
      Vinf = 3367; rhoinf = 0.03116; Tinf = 1828;
      pinf = rhoinf * gas.R * Tinf;
      M = Vinf / Math.sqrt(gamma * gas.R * Tinf);
      h0e = 10.6e6;                                   // tunnel total enthalpy, includes chemical enthalpy of the freestream
      $("calcMach").value = M.toFixed(2);
    } else {
      var a = atmosphere(isMars ? "mars" : "earth", parseFloat($("calcAlt").value));
      Tinf = a.T; pinf = a.p; rhoinf = a.rho;
      M = Math.max(1.01, parseFloat($("calcMach").value) || 5);
      Vinf = M * Math.sqrt(gamma * gas.R * Tinf);
      h0e = cp * Tinf + 0.5 * Vinf * Vinf;
    }

    var M2 = M * M;
    var pr = 1 + 2 * gamma / (gamma + 1) * (M2 - 1);
    var rr = (gamma + 1) * M2 / (2 + (gamma - 1) * M2);
    var pe = pinf * pr, rhoe = rhoinf * rr, Te = Tinf * pr / rr;

    var rhow = pe / (gas.R * Tw);
    var mue = sutherland(gas, Te), muw = sutherland(gas, Tw);
    var beta = Math.sqrt(2 * (pe - pinf) / rhoe) / Rn;
    var hw = cp * Tw;
    var dh = h0e - hw;

    var phi = 1;
    if (model === "eq") phi = 1 + (Math.pow(Le, 0.52) - 1) * hdRatio;
    else if (model === "frozen_cat") phi = 1 + (Math.pow(Le, 0.63) - 1) * hdRatio;
    else if (model === "frozen_noncat") phi = 1 - hdRatio;

    var q = 0.763 * Math.pow(Pr, -0.6) * Math.pow(rhoe * mue, 0.4) * Math.pow(rhow * muw, 0.1) * Math.sqrt(beta) * dh * phi;

    var p02 = Math.pow(rr, gamma / (gamma - 1)) * Math.pow((gamma + 1) / (2 * gamma * M2 - (gamma - 1)), 1 / (gamma - 1));

    $("resHeatFlux").textContent = smart(q / 1e4, 3) + " W/cm² (" + smart(q / 1e6, 3) + " MW/m²)";
    $("resFreestream").textContent = smart(pinf / 1000, 3) + " kPa, " + num(Tinf, 0) + " K, " + smart(rhoinf, 3) + " kg/m³, " + num(Vinf, 0) + " m/s";
    $("resEdgeState").textContent = smart(pe / 1000, 3) + " kPa, " + num(Te, 0) + " K, " + smart(rhoe, 3) + " kg/m³";
    $("resRhoWall").textContent = smart(rhow, 3) + " kg/m³";
    $("resViscosities").textContent = smart(mue * 1e6, 3) + " / " + smart(muw * 1e6, 3) + " μPa·s";
    $("resVelGrad").textContent = sci(beta, 2) + " s⁻¹";
    $("resEnthalpies").textContent = smart(h0e / 1e6, 3) + " / " + smart(hw / 1e6, 2) + " / " + smart(dh / 1e6, 3) + " MJ/kg";
    $("resDissBracket").textContent = num(phi, 3);
    $("resP02Loss").textContent = num(p02 * 100, 1) + " % " + T.retained;

    var hints = [];
    if (isT5) hints.push(T.t5Hint);
    if (model === "convective") hints.push(T.noDissHint);
    if (M > 10) hints.push(T.highMach);
    $("calcHint").textContent = hints.join(" ");
  }

  if ($("calcGas")) {
    frIds.forEach(function (id) {
      $(id).addEventListener("input", runFR);
      $(id).addEventListener("change", runFR);
    });
    runFR();
  }

  /* ------------------------------------------------------------------ travel filter */

  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var c = chip.getAttribute("data-country");
      document.querySelectorAll(".chip").forEach(function (o) {
        var on = o === chip;
        o.classList.toggle("is-on", on);
        o.setAttribute("aria-pressed", String(on));
      });
      document.querySelectorAll(".photo").forEach(function (p) {
        p.hidden = !(c === "all" || p.getAttribute("data-country") === c);
      });
    });
  });

  /* ------------------------------------------------------------------ launch intro */

  var launchEl = $("launch"), canvas = $("launchCanvas"), skipBtn = $("launchSkip");
  var replayBtn = $("replayLaunch");
  var root = document.documentElement;
  var running = false;

  function markSeen() { try { sessionStorage.setItem("kf-launch-played", "1"); } catch (e) {} }

  var LAUNCH_VIDEO = "./images/intro/launch.mp4";
  var LAUNCH_POSTER = "./images/intro/launch_poster.jpg";

  function runLaunch() {
    if (running) return;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (!saveData && document.createElement("video").canPlayType("video/mp4")) runVideoLaunch();
    else runCanvasLaunch();
  }

  // Full-screen launch footage; at the end the smoke-filled frame dissolves into the page.
  function runVideoLaunch() {
    running = true;
    markSeen();
    root.classList.add("launching");
    launchEl.classList.add("is-running", "is-video");
    launchEl.style.transition = "";
    launchEl.style.opacity = "1";

    var video = document.createElement("video");
    video.className = "launch-video";
    video.muted = true; video.defaultMuted = true;
    video.playsInline = true; video.setAttribute("playsinline", "");
    video.preload = "auto";
    video.poster = LAUNCH_POSTER;
    video.src = LAUNCH_VIDEO;
    launchEl.insertBefore(video, launchEl.firstChild);

    var fading = false, done = false, FADE_LEAD = 0.9, FADE_TIME = 2600;

    function cleanup() {
      if (done) return;
      done = true;
      document.removeEventListener("keydown", onKey);
      video.pause(); video.removeAttribute("src"); video.load(); video.remove();
      launchEl.classList.remove("is-running", "is-video");
      launchEl.style.transition = ""; launchEl.style.opacity = "";
      running = false;
      setTimeout(function () { root.classList.remove("revealing"); }, 1200);
    }
    function fadeOut(ms) {
      if (fading) return;
      fading = true;
      clearTimeout(stallTimer);
      root.classList.remove("launching");
      root.classList.add("revealing");
      launchEl.style.transition = "opacity " + ms + "ms cubic-bezier(0.4, 0, 0.2, 1)";
      requestAnimationFrame(function () { launchEl.style.opacity = "0"; video.classList.add("is-dissolving"); });
      setTimeout(cleanup, ms + 60);
    }
    function fallback() {
      // Video could not start (blocked autoplay, offline, missing file): use the drawn launch instead.
      if (fading || done) return;
      done = true;
      document.removeEventListener("keydown", onKey);
      video.remove();
      launchEl.classList.remove("is-video");
      running = false;
      runCanvasLaunch();
    }

    video.addEventListener("timeupdate", function () {
      if (video.duration && video.currentTime >= video.duration - FADE_LEAD) fadeOut(FADE_TIME);
    });
    video.addEventListener("ended", function () { fadeOut(FADE_TIME); });
    video.addEventListener("error", fallback);
    var stallTimer = setTimeout(function () { if (video.currentTime === 0) fallback(); }, 4000);
    video.addEventListener("loadedmetadata", function () { video.playbackRate = 0.85; });
    var p = video.play();
    if (p && p.catch) p.catch(fallback);

    function onKey(e) { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { e.preventDefault(); fadeOut(450); } }
    skipBtn.onclick = function () { fadeOut(450); };
    document.addEventListener("keydown", onKey);
  }

  function runCanvasLaunch() {
    if (!canvas || running) return;
    running = true;
    root.classList.add("launching");
    launchEl.classList.add("is-running");
    launchEl.style.background = "transparent";
    launchEl.style.opacity = "";
    markSeen();

    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, dpr = 1;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    var PAPER = [246, 247, 245];
    var INK = "#14181c";
    var smoke = [];
    var MAX = 1700;
    var t = 0, last = performance.now(), done = false, revealed = false;
    var T_IGNITE = 0.8, T_LIFT = 1.6, FLIGHT = 2.2, T_FADE = 3.9, T_END = 5.7;

    function rand(a, b) { return a + Math.random() * (b - a); }
    function scale() { return Math.max(1.4, Math.min(3.4, H * 0.0034)); }
    function groundY() { return H * 0.8; }
    function padX() { return W * 0.5; }
    function rocketLift(time) {
      if (time < T_LIFT) return 0;
      var s = time - T_LIFT;
      var dist = groundY() + 120 * scale();
      var acc = 2 * dist / (FLIGHT * FLIGHT);
      return 0.5 * acc * s * s;
    }

    function puff(x, y, vx, vy, r, grow, life, shade, alpha) {
      if (smoke.length >= MAX) smoke.shift();
      smoke.push({ x: x, y: y, vx: vx, vy: vy, r: r, grow: grow, life: life, age: 0, shade: shade, a: alpha });
    }

    function drawTower(x, gy, s) {
      var h = 92 * s, w = 9 * s, left = x - 26 * s;
      ctx.strokeStyle = INK; ctx.lineWidth = 1.2; ctx.beginPath();
      ctx.moveTo(left, gy); ctx.lineTo(left, gy - h);
      ctx.moveTo(left + w, gy); ctx.lineTo(left + w, gy - h);
      for (var y = gy; y > gy - h + 1; y -= 9 * s) {
        ctx.moveTo(left, y); ctx.lineTo(left + w, y - 9 * s);
        ctx.moveTo(left + w, y); ctx.lineTo(left, y - 9 * s);
      }
      ctx.moveTo(left, gy - h); ctx.lineTo(left + w, gy - h);
      // swing arm
      ctx.moveTo(left + w, gy - 70 * s); ctx.lineTo(x - 7 * s, gy - 70 * s);
      ctx.stroke();
      // pad and ground
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(0, gy + 0.5); ctx.lineTo(W, gy + 0.5); ctx.strokeStyle = "rgba(20,24,28,0.35)"; ctx.stroke();
      ctx.fillStyle = INK; ctx.fillRect(x - 22 * s, gy - 3 * s, 44 * s, 3 * s);
    }

    function drawRocket(x, base, s, armGone) {
      // base = y of nozzle exit; rocket is 100 units tall above it
      ctx.save();
      ctx.translate(x, base);
      ctx.scale(s, s);
      ctx.lineWidth = 1.4 / s;
      ctx.strokeStyle = INK;
      ctx.fillStyle = "#ffffff";
      // fins
      ctx.beginPath();
      ctx.moveTo(-7, -26); ctx.lineTo(-15, -6); ctx.lineTo(-15, -2); ctx.lineTo(-7, -8); ctx.closePath();
      ctx.moveTo(7, -26); ctx.lineTo(15, -6); ctx.lineTo(15, -2); ctx.lineTo(7, -8); ctx.closePath();
      ctx.fill(); ctx.stroke();
      // nozzle
      ctx.beginPath(); ctx.moveTo(-3.5, -8); ctx.lineTo(-5.5, 0); ctx.lineTo(5.5, 0); ctx.lineTo(3.5, -8); ctx.closePath();
      ctx.fillStyle = "#d9dcd9"; ctx.fill(); ctx.stroke();
      // body and nose
      ctx.beginPath();
      ctx.moveTo(-7, -8); ctx.lineTo(-7, -76);
      ctx.bezierCurveTo(-7, -88, -3, -97, 0, -101);
      ctx.bezierCurveTo(3, -97, 7, -88, 7, -76);
      ctx.lineTo(7, -8); ctx.closePath();
      ctx.fillStyle = "#ffffff"; ctx.fill(); ctx.stroke();
      // interstage line and orange band
      ctx.beginPath(); ctx.moveTo(-7, -46); ctx.lineTo(7, -46); ctx.stroke();
      ctx.fillStyle = "#e8490f"; ctx.fillRect(-7, -71, 14, 3.2);
      ctx.beginPath(); ctx.rect(-7, -71, 14, 3.2); ctx.stroke();
      ctx.restore();
    }

    function drawFlame(x, y, s, power, time) {
      if (power <= 0) return;
      var len = (22 + 44 * power + Math.sin(time * 61) * 3 + rand(-3, 3)) * s;
      var w = (6.2 + rand(-0.5, 0.5)) * s;
      var layers = [["#e8490f", 1, 1], ["#ff9a2e", 0.72, 0.68], ["#ffe08a", 0.42, 0.4]];
      layers.forEach(function (L) {
        ctx.beginPath();
        ctx.moveTo(x - w * L[1], y);
        ctx.bezierCurveTo(x - w * L[1], y + len * 0.35 * L[2], x - w * 0.25 * L[1], y + len * 0.8 * L[2], x, y + len * L[2]);
        ctx.bezierCurveTo(x + w * 0.25 * L[1], y + len * 0.8 * L[2], x + w * L[1], y + len * 0.35 * L[2], x + w * L[1], y);
        ctx.closePath();
        ctx.fillStyle = L[0];
        ctx.globalAlpha = Math.min(1, power * 1.4);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    function frame(now) {
      if (done) return;
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now; t += dt;
      var s = scale(), gy = groundY(), x = padX();
      var lift = rocketLift(t);
      var shake = t > T_IGNITE && t < T_LIFT + 0.4 ? rand(-0.6, 0.6) : 0;
      var nozzleY = gy - 3 * s - lift;
      var power = t < T_IGNITE ? 0 : Math.min(1, (t - T_IGNITE) / 0.45);

      // emit smoke
      if (t < T_IGNITE) {
        if (Math.random() < 0.35) puff(x + 7 * s, gy - 55 * s, rand(10, 30), rand(-14, -4), 2 * s, 9 * s, rand(1.2, 2), 222, 0.5);
      } else if (nozzleY > -40) {
        var onPad = lift < 40 * s;
        var n = onPad ? 14 : 8;
        for (var i = 0; i < n; i++) {
          if (onPad) {
            var dir = Math.random() < 0.5 ? -1 : 1;
            puff(x + rand(-6, 6) * s, gy - rand(0, 8) * s, dir * rand(60, 360) * s / 1.4, rand(-50, -5), rand(6, 11) * s, rand(16, 34) * s, rand(2.6, 4.2), rand(150, 205), rand(0.32, 0.52));
          } else {
            puff(x + rand(-4, 4) * s, nozzleY + rand(28, 60) * s, rand(-22, 22), rand(20, 80), rand(4, 8) * s, rand(14, 28) * s, rand(3.2, 5), rand(150, 210), rand(0.3, 0.5));
          }
        }
      }

      // update smoke
      var drag = Math.pow(0.35, dt);
      for (var k = smoke.length - 1; k >= 0; k--) {
        var p = smoke[k];
        p.age += dt;
        if (p.age > p.life) { smoke.splice(k, 1); continue; }
        p.vx *= drag; p.vy = p.vy * drag - 10 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.r += p.grow * dt;
      }

      // background fade reveals the page underneath
      var fade = t < T_FADE ? 0 : Math.min(1, (t - T_FADE) / (T_END - T_FADE));
      var bgA = 1 - (1 - Math.pow(1 - fade, 3));
      if (fade > 0 && !revealed) { revealed = true; root.classList.add("revealing"); root.classList.remove("launching"); }

      ctx.clearRect(0, 0, W, H);
      if (bgA > 0) { ctx.fillStyle = "rgba(" + PAPER.join(",") + "," + bgA + ")"; ctx.fillRect(0, 0, W, H); }

      ctx.globalAlpha = bgA;
      drawTower(x, gy, s);
      ctx.globalAlpha = 1;
      if (nozzleY > -130 * s) {
        drawFlame(x + shake, nozzleY, s, power, t);
        drawRocket(x + shake, nozzleY, s);
      }

      var smokeFade = t < T_FADE + 0.3 ? 1 : Math.max(0, 1 - (t - T_FADE - 0.3) / (T_END - T_FADE - 0.3));
      for (var j = 0; j < smoke.length; j++) {
        var q = smoke[j];
        var lifeA = q.age < 0.25 ? q.age / 0.25 : 1 - (q.age - 0.25) / (q.life - 0.25);
        var a = q.a * lifeA * smokeFade;
        if (a <= 0.003) continue;
        var g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.r);
        g.addColorStop(0, "rgba(" + q.shade + "," + (q.shade + 3) + "," + (q.shade + 4) + "," + a + ")");
        g.addColorStop(1, "rgba(" + q.shade + "," + (q.shade + 3) + "," + (q.shade + 4) + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2); ctx.fill();
      }

      if (t >= T_END) { finish(); return; }
      requestAnimationFrame(frame);
    }

    function finish() {
      if (done) return;
      done = true;
      window.removeEventListener("resize", resize);
      document.removeEventListener("keydown", onKey);
      root.classList.remove("launching");
      launchEl.classList.remove("is-running");
      launchEl.style.background = "";
      ctx.clearRect(0, 0, W, H);
      smoke.length = 0;
      running = false;
      setTimeout(function () { root.classList.remove("revealing"); }, 1400);
    }

    function skip() {
      if (done) return;
      launchEl.style.transition = "opacity 0.35s ease";
      launchEl.style.opacity = "0";
      root.classList.add("revealing");
      setTimeout(function () { launchEl.style.transition = ""; launchEl.style.opacity = ""; finish(); }, 360);
    }
    function onKey(e) { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { e.preventDefault(); skip(); } }

    skipBtn.onclick = skip;
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(function (n) { last = n; requestAnimationFrame(frame); });
  }

  if (root.classList.contains("launching")) runLaunch();

  if (replayBtn) {
    if (reduceMotion) replayBtn.parentElement.hidden = true;
    replayBtn.addEventListener("click", function () { window.scrollTo(0, 0); runLaunch(); });
  }
})();
