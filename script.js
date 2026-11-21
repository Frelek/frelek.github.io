/**
 * AEROSPACE & AERODYNAMICS SUITE - SCRIPT ENGINE (v2.0)
 * Engineer: Kacper Frelek | Aerodynamics, Aerothermodynamics & CFD
 */

document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // 1. NAVIGATION, BREADCRUMBS & SECTION ROUTING
  // =========================================================================
  const allSections = document.querySelectorAll("section.content-section");
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navMenu = document.querySelector(".nav-menu");

  // Friendly names for breadcrumbs
  const sectionTitles = {
    overview: "Mission Briefing & Overview",
    "exp-urans": "CFD Turbulence: uRANS vs DES vs LES",
    "exp-jet": "Impinging Jet CFD (ANSYS CFX)",
    "exp-aeromech": "Aeromechanics & Turbomachinery (GE Aerospace / EDC)",
    "exp-rfa": "Rocket Aerodynamics (Rocket Factory Augsburg)",
    "proj-starship": "Starship Atmospheric Reentry (15.5M Mesh)",
    "proj-gridfin": "Falcon 9 Grid Fin Aerodynamics (B.Sc. Thesis)",
    "proj-masterthesis": "Master's Thesis: MSL Forebody Aeroheating (WUT MEiL)",
    "proj-urban": "Urban Wind Aerodynamics (1:1500 Wind Tunnel)",
    lab: "Aerodynamics & Aerothermodynamics Interactive Lab",
    travel: "Global Expeditions & Travelogue",
    future: "Future Research Horizons"
  };

  function switchSection(targetId) {
    if (!targetId) targetId = "overview";
    let found = false;

    allSections.forEach(sec => {
      if (sec.id === targetId) {
        sec.classList.add("active");
        found = true;
      } else {
        sec.classList.remove("active");
      }
    });

    if (!found && allSections.length > 0) {
      allSections[0].classList.add("active");
      targetId = allSections[0].id;
    }

    // Update active state in navbar
    document.querySelectorAll(".nav-item").forEach(item => {
      item.classList.remove("active");
      const link = item.querySelector(".nav-link");
      if (link && link.getAttribute("data-target") === targetId) {
        item.classList.add("active");
      }
      // Also highlight dropdown parents if child is active
      const dropdownItems = item.querySelectorAll(".dropdown-item");
      dropdownItems.forEach(di => {
        if (di.getAttribute("data-target") === targetId) {
          item.classList.add("active");
        }
      });
    });

    // Close any open dropdowns and mobile menu
    document.querySelectorAll(".dropdown-menu").forEach(dm => dm.classList.remove("show"));
    if (navMenu) navMenu.classList.remove("open");

    // Smooth scroll to top of main content
    window.scrollTo({ top: 0, behavior: "smooth" });

    // When switching to the Aero Lab, trigger calculator recalculations
    if (targetId === "lab") {
      requestAnimationFrame(() => {
        if (typeof window.runMeshYPlusCalculation === "function") {
          window.runMeshYPlusCalculation();
        }
        if (typeof window.runAerothermoCalculation === "function") {
          window.runAerothermoCalculation();
        }
      });
    }

    requestAnimationFrame(() => {
      triggerKaTeX();
    });
  }

  function triggerKaTeX() {
    if (typeof renderMathInElement === "function") {
      try {
        renderMathInElement(document.body, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '\\[', right: '\\]', display: true},
            {left: '\\(', right: '\\)', display: false},
            {left: '$', right: '$', display: false}
          ],
          throwOnError: false
        });
      } catch (err) {
        console.warn("KaTeX render error:", err);
      }
    }
  }
  window.triggerKaTeX = triggerKaTeX;

  // Delayed retries to guarantee KaTeX runs once deferred scripts are ready
  triggerKaTeX();
  window.addEventListener("load", () => {
    triggerKaTeX();
    setTimeout(triggerKaTeX, 200);
    setTimeout(triggerKaTeX, 600);
    setTimeout(triggerKaTeX, 1200);
  });

  // Re-trigger KaTeX if an equation accordion is toggled
  document.querySelectorAll(".equation-accordion").forEach(acc => {
    acc.addEventListener("toggle", () => {
      if (acc.open) {
        requestAnimationFrame(() => triggerKaTeX());
      }
    });
  });

  // Handle click on routing links
  document.addEventListener("click", e => {
    const routeTarget = e.target.closest("[data-target]");
    if (routeTarget && !routeTarget.classList.contains("disabled")) {
      const targetId = routeTarget.getAttribute("data-target");
      if (targetId) {
        e.preventDefault();
        window.location.hash = targetId;
        switchSection(targetId);
      }
    }
  });

  // Dropdown menus
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      const parent = toggle.closest(".nav-item");
      const menu = parent.querySelector(".dropdown-menu");
      const isOpen = menu.classList.contains("show");
      document.querySelectorAll(".dropdown-menu").forEach(dm => dm.classList.remove("show"));
      if (!isOpen) menu.classList.add("show");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-menu").forEach(dm => dm.classList.remove("show"));
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", e => {
      e.stopPropagation();
      navMenu.classList.toggle("open");
    });
  }

  // Language Switcher - preserves current section hash
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const targetHref = btn.getAttribute("href");
      if (targetHref && !btn.classList.contains("active")) {
        e.preventDefault();
        const baseTarget = targetHref.split("#")[0];
        const currentHash = window.location.hash || "#overview";
        window.location.href = baseTarget + currentHash;
      }
    });
  });

  // Header scroll shadow
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Initial routing based on URL hash
  const initialHash = window.location.hash.replace("#", "");
  switchSection(initialHash || "overview");

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace("#", "");
    switchSection(hash || "overview");
  });

  // =========================================================================
  // 2. INTERACTIVE LIGHTBOX MODAL
  // =========================================================================
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("modalImg");
  const modalCaption = document.getElementById("modalCaption");
  const modalClose = document.getElementById("modalClose");
  const modalPrev = document.getElementById("modalPrev");
  const modalNext = document.getElementById("modalNext");

  let galleryItems = [];
  let currentIndex = 0;

  function refreshGalleryItems() {
    galleryItems = Array.from(document.querySelectorAll(".cfd-card, .travel-thumb, .expandable-img")).map(card => {
      const img = card.querySelector("img") || card;
      const captionEl = card.querySelector(".cfd-caption") || card.querySelector("figcaption");
      const caption = captionEl ? captionEl.textContent : (img.alt || "Aerospace Visual");
      return { src: img.src, caption: caption };
    });
  }

  function openModal(index) {
    refreshGalleryItems();
    if (!galleryItems.length || index < 0 || index >= galleryItems.length) return;
    currentIndex = index;
    modalImg.src = galleryItems[currentIndex].src;
    modalCaption.textContent = galleryItems[currentIndex].caption;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  function showNext() {
    if (!galleryItems.length) return;
    currentIndex = (currentIndex + 1) % galleryItems.length;
    modalImg.src = galleryItems[currentIndex].src;
    modalCaption.textContent = galleryItems[currentIndex].caption;
  }

  function showPrev() {
    if (!galleryItems.length) return;
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    modalImg.src = galleryItems[currentIndex].src;
    modalCaption.textContent = galleryItems[currentIndex].caption;
  }

  document.addEventListener("click", e => {
    const card = e.target.closest(".cfd-card, .travel-thumb, .expandable-img");
    if (card) {
      refreshGalleryItems();
      const img = card.querySelector("img") || card;
      const idx = galleryItems.findIndex(item => item.src === img.src);
      if (idx !== -1) openModal(idx);
    }
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalPrev) modalPrev.addEventListener("click", showPrev);
  if (modalNext) modalNext.addEventListener("click", showNext);

  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener("keydown", e => {
    if (!modal || !modal.classList.contains("active")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });

  // =========================================================================
  // 3. PROJECT 1: BOUNDARY LAYER & NEAR-WALL MESH QUALITY (y⁺)
  // =========================================================================
  const meshVel = document.getElementById("meshVel");
  const meshChord = document.getElementById("meshChord");
  const meshTargetYPlus = document.getElementById("meshTargetYPlus");
  const meshFluidSelect = document.getElementById("meshFluidSelect");
  const meshAltGroup = document.getElementById("meshAltGroup");
  const meshAlt = document.getElementById("meshAlt");
  const meshAltBadge = document.getElementById("meshAltBadge");
  const meshNu = document.getElementById("meshNu");
  const meshDensity = document.getElementById("meshDensity");
  const btnToggleAtmTable = document.getElementById("btnToggleAtmTable");
  const atmTableContainer = document.getElementById("atmTableContainer");
  const atmTableTitle = document.getElementById("atmTableTitle");
  const atmTableBody = document.getElementById("atmTableBody");

  const resFirstCell = document.getElementById("resFirstCell");
  const resRe = document.getElementById("resRe");
  const resBLThickness = document.getElementById("resBLThickness");
  const resFrictionVel = document.getElementById("resFrictionVel");
  const resCf = document.getElementById("resCf");
  const cfOriginText = document.getElementById("cfOriginText");
  const cfOriginBox = document.getElementById("cfOriginBox");

  // Atmospheric Look-up Model for Earth (US Standard 1976) and Mars (CO2 Entry)
  function getAtmosphereProperties(planet, altKm) {
    const z = Math.max(0.0, Math.min(80.0, parseFloat(altKm) || 0.0));
    let T, P, rho, mu, nu;

    if (planet === "earth") {
      // US Standard Atmosphere 1976
      if (z <= 11.0) {
        T = 288.15 - 6.5 * z;
        P = 101325.0 * Math.pow(288.15 / T, -5.2561);
      } else if (z <= 20.0) {
        T = 216.65;
        P = 22632.1 * Math.exp(-((z - 11.0) * 1000.0) / 6341.62);
      } else if (z <= 32.0) {
        T = 216.65 + 1.0 * (z - 20.0);
        P = 5474.89 * Math.pow(216.65 / T, 34.1632);
      } else if (z <= 47.0) {
        T = 228.65 + 2.8 * (z - 32.0);
        P = 868.019 * Math.pow(228.65 / T, 17.0816);
      } else if (z <= 51.0) {
        T = 270.65;
        P = 110.906 * Math.exp(-((z - 47.0) * 1000.0) / 7922.0);
      } else if (z <= 71.0) {
        T = 270.65 - 2.8 * (z - 51.0);
        P = 66.9388 * Math.pow(270.65 / T, -12.2011);
      } else {
        T = 214.65 - 2.0 * (z - 71.0);
        P = 3.9564 * Math.pow(214.65 / T, -17.0816);
      }
      const R_air = 287.05;
      rho = P / (R_air * T);
      // Sutherland law for air
      mu = 1.716e-5 * Math.pow(T / 273.15, 1.5) * ((273.15 + 110.4) / (T + 110.4));
      nu = mu / rho;
    } else if (planet === "mars") {
      // Martian CO2 Atmosphere Model (Scale height H ~ 11.1 km, surface P = 699 Pa)
      P = 699.0 * Math.exp(-z / 11.1);
      if (z <= 7.0) {
        T = 242.15 - 0.998 * z;
      } else {
        T = Math.max(110.0, 249.7 - 2.22 * z);
      }
      const R_co2 = 188.90;
      rho = P / (R_co2 * T);
      // Sutherland law for CO2
      mu = 1.370e-5 * Math.pow(T / 273.15, 1.5) * ((273.15 + 222.0) / (T + 222.0));
      nu = mu / rho;
    } else {
      // Incompressible Liquid Water (20°C)
      T = 293.15;
      P = 101325.0;
      rho = 998.2;
      mu = 1.002e-3;
      nu = 1.004e-6;
    }

    return { z, T, P, rho, mu, nu };
  }

  // Populate interactive atmospheric look-up table
  const ATM_TABLE_GRID = [0, 2, 5, 8, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80];
  function renderAtmosphericTable(planet, currentZ) {
    if (!atmTableBody) return;
    atmTableBody.innerHTML = "";

    if (planet === "water") {
      atmTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:1rem;">Incompressible Liquid Water (20°C): ρ = 998.2 kg/m³, ν = 1.004×10⁻⁶ m²/s (Independent of altitude)</td></tr>`;
      return;
    }

    ATM_TABLE_GRID.forEach(z => {
      const data = getAtmosphereProperties(planet, z);
      const tr = document.createElement("tr");
      if (Math.abs(z - currentZ) < 1.5) {
        tr.className = "active-row";
      }
      const p_str = data.P >= 1000 ? `${(data.P / 1000).toFixed(2)} k` : data.P.toFixed(1);
      const rho_str = data.rho < 0.001 ? data.rho.toExponential(2) : data.rho.toFixed(4);
      tr.innerHTML = `
        <td>${z} km</td>
        <td>${data.T.toFixed(1)}</td>
        <td>${p_str}</td>
        <td>${rho_str}</td>
        <td>${(data.mu * 1e6).toFixed(1)}</td>
        <td>${data.nu.toExponential(2)}</td>
      `;
      atmTableBody.appendChild(tr);
    });
  }

  // Toggle atmospheric table container
  if (btnToggleAtmTable && atmTableContainer) {
    btnToggleAtmTable.addEventListener("click", () => {
      atmTableContainer.classList.toggle("open");
    });
  }

  // Handle fluid & altitude changes
  function updateFluidAtmosphereState() {
    const planet = meshFluidSelect ? meshFluidSelect.value : "earth";
    const altKm = meshAlt ? parseFloat(meshAlt.value) || 0.0 : 0.0;

    if (planet === "water") {
      if (meshAltGroup) meshAltGroup.style.display = "none";
      if (atmTableContainer) atmTableContainer.classList.remove("open");
      if (meshNu) meshNu.value = (1.004e-6).toExponential(3);
      if (meshDensity) meshDensity.value = "998.2";
    } else {
      if (meshAltGroup) meshAltGroup.style.display = "block";
      if (meshAltBadge) {
        meshAltBadge.textContent = `z = ${altKm} km (${altKm === 0 ? "Sea Level / Surface" : altKm < 20 ? "Troposphere / Lower" : "Stratosphere / Entry"})`;
      }
      if (atmTableTitle) {
        atmTableTitle.textContent = planet === "earth" 
          ? "Earth US Standard Atmosphere 1976 Look-up Table" 
          : "Martian CO₂ Atmosphere Entry Look-up Table";
      }

      const props = getAtmosphereProperties(planet, altKm);
      if (meshNu) meshNu.value = props.nu.toExponential(3);
      if (meshDensity) meshDensity.value = props.rho < 0.01 ? props.rho.toExponential(3) : props.rho.toFixed(4);
      renderAtmosphericTable(planet, altKm);
    }
  }

  if (meshFluidSelect) {
    meshFluidSelect.addEventListener("change", () => {
      updateFluidAtmosphereState();
      runMeshYPlusCalculation();
    });
  }

  if (meshAlt) {
    meshAlt.addEventListener("input", () => {
      updateFluidAtmosphereState();
      runMeshYPlusCalculation();
    });
  }

  // Store last boundary layer state for Project 1B sync
  window.lastBoundaryLayerState = {
    u_tau: 2.25,
    delta_99_m: 0.0172,
    nu: 1.46e-5,
    L: 1.0,
    U: 68.0
  };

  function runMeshYPlusCalculation() {
    if (!meshVel || !meshChord || !meshTargetYPlus) return;

    const U = Math.max(0.01, parseFloat(meshVel.value) || 68.0);
    const L = Math.max(0.001, parseFloat(meshChord.value) || 1.0);
    const yPlusTarget = Math.max(0.01, parseFloat(meshTargetYPlus.value) || 1.0);
    const nu = Math.max(1e-8, parseFloat(meshNu ? meshNu.value : 1.46e-5) || 1.46e-5);
    const rho = Math.max(1e-6, parseFloat(meshDensity ? meshDensity.value : 1.225) || 1.225);

    // 1. Reynolds Number: Re_L = U * L / nu
    const Re_L = (U * L) / nu;
    const isTurbulent = Re_L >= 5e5;

    if (resRe) {
      const regime = isTurbulent ? "Turbulent Flow (Re_L ≥ 5×10⁵)" : "Laminar Flow (Re_L < 5×10⁵)";
      if (Re_L >= 1e6) {
        resRe.textContent = `${Re_L.toExponential(2)} (${(Re_L / 1e6).toFixed(2)}M — ${regime})`;
      } else {
        resRe.textContent = `${Re_L.toExponential(2)} (${Math.round(Re_L).toLocaleString()} — ${regime})`;
      }
    }

    // 2. Skin friction coefficient (Cf) & Boundary Layer Thickness (delta_99)
    let Cf, delta_99_m;
    if (!isTurbulent) {
      // Blasius exact laminar flat-plate solution
      Cf = 0.664 / Math.sqrt(Math.max(10, Re_L));
      delta_99_m = 5.0 * L / Math.sqrt(Math.max(10, Re_L));
      if (cfOriginText) {
        cfOriginText.innerHTML = `For laminar boundary layer (\\(Re_L = ${Re_L.toExponential(2)} < 5\\times 10^5\\)), \\(C_f\\) is obtained from the exact <strong>H. Blasius (1908)</strong> self-similar boundary-layer solution to the Prandtl laminar boundary layer equations: <code>C_f = 0.664 / \\sqrt{Re_L}</code>.`;
      }
    } else {
      // Schlichting & Gersten / Frank M. White turbulent flat-plate correlation
      Cf = 0.0592 * Math.pow(Math.max(1000, Re_L), -0.2);
      delta_99_m = 0.37 * L * Math.pow(Math.max(1000, Re_L), -0.2);
      if (cfOriginText) {
        cfOriginText.innerHTML = `For turbulent boundary layer (\\(Re_L = ${Re_L.toExponential(2)} \\ge 5\\times 10^5\\)), \\(C_f\\) is obtained from <strong>Schlichting & Gersten (2016) / Frank M. White (Fluid Mechanics 7th ed., Sec. 7.4)</strong>: <code>C_f = 0.0592 · Re_L^(-0.2)</code>, derived from the classical Prandtl 1/7th power turbulent velocity profile on a smooth boundary.`;
      }
    }

    if (resCf) resCf.textContent = Cf.toExponential(3);

    // 3. Wall shear stress & friction velocity: tau_w = 0.5 * rho * U^2 * Cf, u_tau = sqrt(tau_w / rho)
    const tau_w = 0.5 * rho * U * U * Cf;
    const u_tau = Math.sqrt(Math.max(1e-7, tau_w / rho));
    if (resFrictionVel) {
      resFrictionVel.textContent = `${u_tau.toFixed(2)} m/s | ${tau_w.toFixed(2)} Pa`;
    }

    // 4. Boundary Layer Thickness display
    if (resBLThickness) {
      if (delta_99_m < 0.001) {
        resBLThickness.textContent = `${(delta_99_m * 1e6).toFixed(1)} μm`;
      } else if (delta_99_m < 1.0) {
        resBLThickness.textContent = `${(delta_99_m * 1000).toFixed(1)} mm`;
      } else {
        resBLThickness.textContent = `${delta_99_m.toFixed(2)} m`;
      }
    }

    // 5. First cell height: delta_y = (yPlus * nu) / u_tau
    const delta_y_m = (yPlusTarget * nu) / u_tau;
    const delta_y_um = delta_y_m * 1e6;
    const delta_y_mm = delta_y_m * 1000;
    if (resFirstCell) {
      if (delta_y_um < 1000) {
        resFirstCell.textContent = `${delta_y_um.toFixed(1)} μm (${delta_y_mm.toFixed(4)} mm)`;
      } else {
        resFirstCell.textContent = `${delta_y_mm.toFixed(3)} mm`;
      }
    }

    // Save state for Project 1B sync
    window.lastBoundaryLayerState = { u_tau, delta_99_m, nu, L, U };
  }

  window.runMeshYPlusCalculation = runMeshYPlusCalculation;

  [meshVel, meshChord, meshTargetYPlus].forEach(input => {
    if (input) {
      input.addEventListener("input", runMeshYPlusCalculation);
      input.addEventListener("change", runMeshYPlusCalculation);
    }
  });

  updateFluidAtmosphereState();
  runMeshYPlusCalculation();



  // =========================================================================
  // 4. PROJECT 2: FAY-RIDDELL HYPERSONIC AEROHEATING & GAS DYNAMICS SOLVER
  // =========================================================================
  const calcGas = document.getElementById("calcGas");
  const calcMach = document.getElementById("calcMach");
  const calcAlt = document.getElementById("calcAlt");
  const calcNoseRadius = document.getElementById("calcNoseRadius");
  const calcCatalysis = document.getElementById("calcCatalysis");
  const calcLewis = document.getElementById("calcLewis");
  const calcTw = document.getElementById("calcTw");
  const btnThesisBenchmark = document.getElementById("btnThesisBenchmark");

  const resHeatFlux = document.getElementById("resHeatFlux");
  const resVelGrad = document.getElementById("resVelGrad");
  const resEnthalpies = document.getElementById("resEnthalpies");
  const resDissBracket = document.getElementById("resDissBracket");
  const resEdgeState = document.getElementById("resEdgeState");
  const resViscosities = document.getElementById("resViscosities");
  const resRhoWall = document.getElementById("resRhoWall");
  const resFreestream = document.getElementById("resFreestream");
  const resP02Loss = document.getElementById("resP02Loss");

  function runAerothermoCalculation() {
    if (!calcMach || !calcAlt || !calcGas) return;

    const M = Math.max(0.1, parseFloat(calcMach.value) || 5.0);
    const altKm = Math.max(0.0, parseFloat(calcAlt.value) || 0.0);
    const gas = calcGas.value; // 'co2' or 'air'
    const Rn = Math.max(0.001, parseFloat(calcNoseRadius ? calcNoseRadius.value : 0.04445) || 0.04445);
    const catalysis = calcCatalysis ? calcCatalysis.value : "eq";
    const Le = Math.max(0.1, parseFloat(calcLewis ? calcLewis.value : 1.4) || 1.4);
    const Tw = Math.max(50.0, parseFloat(calcTw ? calcTw.value : 300.0) || 300.0);

    const isT5Benchmark = gas === "co2_t5";
    const isMars = gas === "co2" || gas === "co2_mars" || isT5Benchmark;

    // 1. Thermodynamic & Gas constants (Master's Thesis p. 20–23)
    let gamma, R_gas, cp, Pr;
    let suth_mu0, suth_T0, suth_S;
    let diss_Tmid, diss_Tscale, diss_hmax;

    if (isMars) {
      // Martian CO2 Atmosphere (Thesis p. 22: R_CO2 = 188.9 J/kg·K, gamma = 1.30, Pr = 0.70)
      gamma = 1.30;
      R_gas = 188.90;                               // J/(kg·K)
      cp = (gamma / (gamma - 1.0)) * R_gas;         // ~818.57 J/(kg·K) (Thesis cp ≈ 818 J/kg·K)
      Pr = 0.70;                                    // Thesis p. 23
      suth_mu0 = 1.370e-5;                          // Pa·s at T0
      suth_T0 = 273.15;                             // K
      suth_S = 222.0;                               // Sutherland temperature K
      diss_Tmid = 3800.0;                           // K (CO2 -> CO + O dissociation onset/midpoint)
      diss_Tscale = 1200.0;
      diss_hmax = 1.20e7;                           // J/kg effective dissociation enthalpy limit
    } else {
      // Earth Air Atmosphere (gamma = 1.40, R_air = 287.05 J/kg·K, Pr = 0.71)
      gamma = 1.40;
      R_gas = 287.05;                               // J/(kg·K)
      cp = (gamma / (gamma - 1.0)) * R_gas;         // ~1004.7 J/(kg·K)
      Pr = 0.71;
      suth_mu0 = 1.716e-5;                          // Pa·s
      suth_T0 = 273.15;                             // K
      suth_S = 110.4;                               // Sutherland temperature K
      diss_Tmid = 4600.0;                           // K (O2, N2 dissociation)
      diss_Tscale = 1500.0;
      diss_hmax = 1.50e7;                           // J/kg
    }

    // 2. Freestream conditions: Altitude Model vs T5 Shock Tunnel Benchmark
    let T_inf, P_inf, rho_inf, V_inf, a_inf, effective_M;

    if (isT5Benchmark) {
      // Exact T5 Hypervelocity Tunnel Shot 2254 conditions (Master's Thesis p. 21–22)
      V_inf = 3367.0;                               // m/s
      rho_inf = 0.03116;                            // kg/m³
      T_inf = 1828.0;                               // K
      P_inf = rho_inf * R_gas * T_inf;              // ~1.08 × 10⁴ Pa
      a_inf = Math.sqrt(gamma * R_gas * T_inf);     // ~670 m/s
      effective_M = V_inf / a_inf;                  // ~5.025
    } else if (isMars) {
      // Mars atmospheric model: scale height H ≈ 11.1 km
      P_inf = 699.0 * Math.exp(-altKm / 11.1);
      if (altKm <= 7.0) {
        T_inf = 242.15 - 0.998 * altKm;
      } else {
        T_inf = Math.max(120.0, 249.7 - 2.22 * altKm);
      }
      rho_inf = P_inf / (R_gas * T_inf);
      a_inf = Math.sqrt(gamma * R_gas * T_inf);
      effective_M = M;
      V_inf = effective_M * a_inf;
    } else {
      // Earth US Standard Atmosphere 1976
      if (altKm <= 11.0) {
        T_inf = 288.15 - 6.5 * altKm;
        P_inf = 101325.0 * Math.pow(288.15 / T_inf, -5.2561);
      } else if (altKm <= 20.0) {
        T_inf = 216.65;
        P_inf = 22632.1 * Math.exp(-((altKm - 11.0) * 1000.0) / 6341.62);
      } else if (altKm <= 32.0) {
        T_inf = 216.65 + 1.0 * (altKm - 20.0);
        P_inf = 5474.89 * Math.pow(216.65 / T_inf, 34.1632);
      } else if (altKm <= 47.0) {
        T_inf = 228.65 + 2.8 * (altKm - 32.0);
        P_inf = 868.019 * Math.pow(228.65 / T_inf, 17.0816);
      } else {
        T_inf = Math.max(150.0, 270.65 - 2.8 * (altKm - 47.0));
        P_inf = 110.906 * Math.exp(-((altKm - 47.0) * 1000.0) / 7922.0);
      }
      rho_inf = P_inf / (R_gas * T_inf);
      a_inf = Math.sqrt(gamma * R_gas * T_inf);
      effective_M = M;
      V_inf = effective_M * a_inf;
    }

    // 3. Stagnation streamline post-normal shock edge state (Thesis p. 22)
    let p_ratio, rho_ratio, T_ratio;
    if (effective_M > 1.0) {
      p_ratio = 1.0 + ((2.0 * gamma) / (gamma + 1.0)) * (effective_M * effective_M - 1.0);
      rho_ratio = ((gamma + 1.0) * effective_M * effective_M) / (2.0 + (gamma - 1.0) * effective_M * effective_M);
      T_ratio = p_ratio / rho_ratio;
    } else {
      p_ratio = 1.0;
      rho_ratio = 1.0;
      T_ratio = 1.0;
    }

    const p_e = P_inf * p_ratio;
    const rho_e = rho_inf * rho_ratio;
    const T_e = T_inf * T_ratio;

    // 4. Cold Wall State (Thesis p. 22: Tw = 300 K, pw ≈ pe)
    const p_w = p_e;
    const rho_w = p_w / (R_gas * Tw);

    // 5. Sutherland Viscosities (Thesis p. 22–23)
    function sutherlandMu(T) {
      return suth_mu0 * Math.pow(T / suth_T0, 1.5) * ((suth_T0 + suth_S) / (T + suth_S));
    }
    // High-temperature edge viscosity (for T5, thesis reports ~2.45e-4 Pa·s)
    const mu_e = isT5Benchmark ? 2.45e-4 : sutherlandMu(T_e);
    const mu_w = sutherlandMu(Tw);

    // 6. Stagnation-Line Velocity Gradient (Thesis Eq. 9 p. 21 & p. 23)
    //    (du_e / dx)_s = (1 / R_n) * sqrt( 2 * (p_e - P_inf) / rho_e )
    const delta_p = Math.max(1.0, p_e - P_inf);
    const beta = (1.0 / Rn) * Math.sqrt((2.0 * delta_p) / rho_e);

    // 7. Enthalpies: Stagnation h_0e and Wall h_w (Thesis p. 23)
    // For T5 shot 2254, total kinetic/reservoir enthalpy h0 ≈ 10.6 MJ/kg
    const h_0e = isT5Benchmark ? 10.60e6 : (cp * T_inf + 0.5 * V_inf * V_inf);
    const h_w = cp * Tw;
    const delta_h = Math.max(100.0, h_0e - h_w);

    // 8. Dissociation Enthalpy h_D & Catalysis Bracket (Thesis Eqs. 5, 7, 8, p. 20–23)
    const alpha_diss = 1.0 / (1.0 + Math.exp(-(T_e - diss_Tmid) / diss_Tscale));
    const h_D = alpha_diss * diss_hmax;
    const hD_over_h0e = Math.min(0.75, h_D / h_0e);

    let catalysisBracket = 1.0;
    if (catalysis === "eq") {
      // Thesis Eq. 5: [1 + (Le^0.52 - 1) * (h_D / h_0e)]
      catalysisBracket = 1.0 + (Math.pow(Le, 0.52) - 1.0) * hD_over_h0e;
    } else if (catalysis === "frozen_cat") {
      // Thesis Eq. 7: [1 + (Le^0.63 - 1) * (h_D / h_0e)]
      catalysisBracket = 1.0 + (Math.pow(Le, 0.63) - 1.0) * hD_over_h0e;
    } else if (catalysis === "frozen_noncat") {
      // Thesis Eq. 8: [1 - (h_D / h_0e)]
      catalysisBracket = Math.max(0.1, 1.0 - hD_over_h0e);
    } else {
      // Thesis p. 23: Le ≈ 1.0, convective simplification bracket = 1.0
      catalysisBracket = 1.0;
    }

    // 9. Classical Fay-Riddell Laminar Stagnation Heat Flux Equation (Thesis Eq. 5)
    //    q_w = 0.76 * Pr^(-0.6) * (rho_e * mu_e)^0.4 * (rho_w * mu_w)^0.1 * sqrt(beta) * (h_0e - h_w) * [bracket]
    const term_Pr = 0.76 * Math.pow(Pr, -0.6);
    const term_edge = Math.pow(rho_e * mu_e, 0.4);
    const term_wall = Math.pow(rho_w * mu_w, 0.1);
    const term_grad = Math.sqrt(beta);

    const qw_W_m2 = term_Pr * term_edge * term_wall * term_grad * delta_h * catalysisBracket;
    const qw_kW_m2 = qw_W_m2 / 1000.0;
    const qw_MW_m2 = qw_W_m2 / 1e6;
    const qw_W_cm2 = qw_W_m2 / 1e4;

    // 10. Normal Shock Total Pressure Retention (Rayleigh Pitot)
    let p02_loss_str = "100.0% (Isentropic)";
    if (M > 1.0) {
      const term1 = ((gamma + 1.0) * M * M) / (2.0 + (gamma - 1.0) * M * M);
      const term2 = (gamma + 1.0) / (2.0 * gamma * M * M - (gamma - 1.0));
      const p02_p01 = Math.pow(term1, gamma / (gamma - 1.0)) * Math.pow(term2, 1.0 / (gamma - 1.0));
      p02_loss_str = `${(p02_p01 * 100.0).toFixed(1)}% (${((1.0 - p02_p01) * 100.0).toFixed(1)}% entropy loss)`;
    }

    // Update DOM Displays
    if (resHeatFlux) {
      if (qw_MW_m2 >= 1.0) {
        resHeatFlux.textContent = `${qw_MW_m2.toFixed(2)} MW/m² (${qw_W_cm2.toFixed(1)} W/cm²)`;
      } else {
        resHeatFlux.textContent = `${qw_kW_m2.toFixed(1)} kW/m² (${qw_W_cm2.toFixed(2)} W/cm²)`;
      }
    }

    if (resVelGrad) {
      resVelGrad.textContent = `${beta.toExponential(2)} s⁻¹ (${Math.round(beta).toLocaleString()} s⁻¹)`;
    }

    if (resEnthalpies) {
      resEnthalpies.textContent = `${(h_0e / 1e6).toFixed(2)} MJ/kg / ${(h_w / 1e6).toFixed(2)} MJ/kg (Δh = ${(delta_h / 1e6).toFixed(2)} MJ/kg)`;
    }

    if (resDissBracket) {
      resDissBracket.textContent = `${catalysisBracket.toFixed(3)} (h_D/h_0e = ${hD_over_h0e.toFixed(3)})`;
    }

    if (resEdgeState) {
      const pe_str = p_e >= 1e5 ? `${(p_e / 1e3).toFixed(1)} kPa` : `${p_e.toFixed(0)} Pa`;
      resEdgeState.textContent = `${pe_str} | ${Math.round(T_e).toLocaleString()} K | ${rho_e.toFixed(3)} kg/m³`;
    }

    if (resViscosities) {
      resViscosities.textContent = `${(mu_e * 1e6).toFixed(1)} μPa·s / ${(mu_w * 1e6).toFixed(1)} μPa·s`;
    }

    if (resRhoWall) {
      resRhoWall.textContent = `${rho_w.toFixed(2)} kg/m³ (Tw = ${Tw} K)`;
    }

    if (resFreestream) {
      const pinf_str = P_inf >= 1e3 ? `${(P_inf / 1e3).toFixed(2)} kPa` : `${P_inf.toFixed(1)} Pa`;
      resFreestream.textContent = `${pinf_str} | ${Math.round(T_inf)} K | ${rho_inf.toFixed(4)} kg/m³ | ${Math.round(V_inf).toLocaleString()} m/s`;
    }

    if (resP02Loss) {
      resP02Loss.textContent = p02_loss_str;
    }
  }

  window.runAerothermoCalculation = runAerothermoCalculation;

  // Event listeners for Fay-Riddell calculator
  [calcGas, calcMach, calcAlt, calcNoseRadius, calcCatalysis, calcLewis, calcTw].forEach(input => {
    if (input) {
      input.addEventListener("input", runAerothermoCalculation);
      input.addEventListener("change", runAerothermoCalculation);
    }
  });

  // Benchmark button handler: Load Thesis T5 Shot 2254 Benchmark
  if (btnThesisBenchmark) {
    btnThesisBenchmark.addEventListener("click", () => {
      if (calcGas) calcGas.value = "co2_t5";
      if (calcMach) calcMach.value = "5.02";
      if (calcAlt) calcAlt.value = "0";
      if (calcNoseRadius) calcNoseRadius.value = "0.04445";
      if (calcCatalysis) calcCatalysis.value = "convective";
      if (calcLewis) calcLewis.value = "1.0";
      if (calcTw) calcTw.value = "300";
      runAerothermoCalculation();
    });
  }

  runAerothermoCalculation();

  // =========================================================================
  // 6. TRAVEL PHOTO FILTERING
  // =========================================================================
  const travelChips = document.querySelectorAll(".travel-chip");
  const travelThumbs = document.querySelectorAll(".travel-combined-grid .travel-thumb, .travel-thumb");

  travelChips.forEach(chip => {
    chip.addEventListener("click", () => {
      travelChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const filter = chip.getAttribute("data-country");
      travelThumbs.forEach(thumb => {
        if (filter === "all" || thumb.getAttribute("data-country") === filter) {
          thumb.style.display = "block";
        } else {
          thumb.style.display = "none";
        }
      });
    });
  });
});
