let currentDragonId = null;

/* ================================
   NAME VARIANTS
================================ */
if (!location.hostname.includes("vercel.app")) {
  throw new Error("Unauthorized");
}



function generateNameVariants(name) {
  const clean = str => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const lower = name.toLowerCase();
  const words = lower.split(/\s+/);
  const variants = new Set();

  variants.add(clean(lower));

  if (words.length > 1) {
    variants.add(words.slice(1).join(""));
    variants.add(clean(words[words.length - 1]));
  }

  if (lower.includes("high")) {
    const highIdx = words.indexOf("high");
    if (highIdx !== -1 && highIdx + 1 < words.length) {
      let parts = words.slice(highIdx + 1);
      if (parts[parts.length - 1] === "dragon") parts = parts.slice(0, -1);
      variants.add(parts.join(""));
      variants.add(parts.join("_"));
    }
  }

  if (words.length >= 3) {
    variants.add(words.slice(0, 2).join(""));
    variants.add(words.slice(0, -1).join(""));
    variants.add(words.slice(-2).join(""));
    variants.add(words[0] + words.slice(1).join(""));
  }

  variants.add(lower.replace(/\s+/g, ""));
  variants.add(lower.replace(/\s+/g, "_"));

  return [...variants];
}

/* ================================
   SHOW DRAGON IMAGES
================================ */

function showDragonImages(code, name) {
  const baseUrl =
    "https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui/dragons/";

  const versions = [0, 1, 2, 3];
  const skins = ["", "_skin1", "_skin2", "_skin3", "_skin_1", "_skin_2", "_skin_3"];
  const suffixes = ["", "_a", "_b", "_c", "_d", "_e", "_f", "_g", "_h"];

  const codeOverrides = {
    "2629": "greed",
    "2523": "rulerofsins",
    "2522": "envy",
    "2521": "gluttony",
    "2514": "wrath",
    "2513": "pride",
    "3266": "beautheestrategist",
    "1001": "fire_bird",
    "1002": "mercurium",
    "1004": "lantern",
    "1028": "carnivore",
    "1041": "legend",
    "1044": "shit",
    "1045": "vulcano",
    "1053": "wind",
    "1056": "chili",
    "1063": "incandescent",
    "1073": "earth_pure",
    "1074": "fire_pure",
    "1075": "water_pure",
    "1076": "plant_pure",
    "1077": "electric_pure",
    "1078": "ice_pure",
    "1079": "metal_pure",
    "1080": "dark_pure",
    "1085": "air",
    "1093": "american",
    "1104": "fireice",
    "1130": "fire",
    "1114": "cool_fire",
    "1127": "st_patricks",
    "1129": "hulk",
    "1131": "fool",
    "1135": "diamond",
    "1139": "blue",
    "1140": "angel",
    "1142": "fire",
    "3421": "highwar",
    "3447": "ghostofthepast"
  };

  const container = document.getElementById("dragonImages");
  container.innerHTML = "";

  if (code === "9900") code = "2684";
  if (code === "1033") code = "3140";
  if (code === "1113") code = "1020";
  if (code === "1114") code = "1023";
  if (code === "1142") code = "1020";

  let variants = codeOverrides[code]
    ? [codeOverrides[code]]
    : generateNameVariants(name);

  versions.forEach(v => {
    suffixes.forEach(suffix => {
      skins.forEach(skin => {
        if (skin !== "" && v !== 3) return;

        variants.forEach(variant => {
          const img = document.createElement("img");
          img.src = `${baseUrl}ui_${code}_dragon_${variant}${skin}${suffix}_${v}@2x.png`;
          img.onerror = () => img.remove();
          container.appendChild(img);
        });
      });
    });
  });

  currentDragonId = code;

  const modal = document.getElementById("dragonModal");
  modal.style.display = "block";
  setTimeout(() => modal.classList.add("show"), 10);
}

function closeModal() {
  const modal = document.getElementById("dragonModal");
  modal.classList.remove("show");
  setTimeout(() => (modal.style.display = "none"), 400);
}

/* ================================
   CLICK DRAGON ITEMS
================================ */

document.querySelectorAll(".dragon-item").forEach(item => {
  item.addEventListener("click", () => {
    const text = item.textContent.trim();
    const match = text.match(/^(\d+)\s*-\s*(.+?)(?:\s*Dragon)?$/i);
    if (match) {
      showDragonImages(match[1], match[2]);
    }
  });
});

/* ================================
   SEARCH FILTER
================================ */

function filterDragons() {
  const input = document.getElementById("search").value.toLowerCase();
  let visibleCount = 0;

  document.querySelectorAll(".dragon-item").forEach(item => {
    if (input === "" || item.textContent.toLowerCase().includes(input)) {
      item.style.display = "block";
      visibleCount++;
    } else {
      item.style.display = "none";
    }
  });

  document.getElementById("search-status").textContent =
    `Showing ${visibleCount} dragons`;

  document.getElementById("no-results").style.display =
    visibleCount === 0 ? "block" : "none";
}

/* ================================
   MUSIC SYSTEM (Saved)
================================ */

const bgMusic = document.getElementById("bgMusic");

window.addEventListener("DOMContentLoaded", () => {
  const savedVolume = localStorage.getItem("musicVolume");
  const savedMuted = localStorage.getItem("musicMuted");

  if (savedVolume !== null) bgMusic.volume = parseFloat(savedVolume);
  if (savedMuted !== null) bgMusic.muted = savedMuted === "true";
});

bgMusic.addEventListener("volumechange", () => {
  localStorage.setItem("musicVolume", bgMusic.volume);
  localStorage.setItem("musicMuted", bgMusic.muted);
});

document.addEventListener("click", () => {
  bgMusic.play().catch(() => {});
}, { once: true });

/* ================================
   SCROLL TO TOP
================================ */

const toTopBtn = document.getElementById("toTop");

window.addEventListener("scroll", () => {
  if (!toTopBtn) return;
  toTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

toTopBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ================================
   COPY DRAGON LINK
================================ */

const copyBtn = document.getElementById("copyDragonLink");

copyBtn?.addEventListener("click", () => {
  if (!currentDragonId) return;

  const link =
    `${location.origin}${location.pathname}?d=${currentDragonId}`;

  navigator.clipboard.writeText(link).then(() => {
    copyBtn.textContent = "Copied";
    setTimeout(() => {
      copyBtn.textContent = "Copy link";
    }, 1200);
  });
});

/* ================================
   DEEP LINK AUTO OPEN
================================ */

window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  const dragonId = params.get("d");
  if (!dragonId) return;

  const items = document.querySelectorAll(".dragon-item");

  for (const item of items) {
    const text = item.textContent.trim();
    const match = text.match(/^(\d+)\s*-\s*(.+?)(?:\s*Dragon)?$/i);

    if (match && match[1] === dragonId) {
      showDragonImages(match[1], match[2]);
      break;
    }
  }
});

/* ================================
   MUSIC UI CONTROLS
================================ */

const muteBtn = document.getElementById("muteBtn");
const volumeSlider = document.getElementById("volumeSlider");
const volumeText = document.getElementById("volumeText");

// Load saved settings visually
window.addEventListener("DOMContentLoaded", () => {
  const savedVolume = localStorage.getItem("musicVolume");
  const savedMuted = localStorage.getItem("musicMuted");

  if (savedVolume !== null) {
    const volumePercent = Math.round(parseFloat(savedVolume) * 100);
    volumeSlider.value = volumePercent;
    volumeText.textContent = volumePercent + "%";
  }

  if (savedMuted === "true") {
    muteBtn.textContent = "🔇";
  }
});

// Volume slider change
volumeSlider.addEventListener("input", () => {
  const volume = volumeSlider.value / 100;
  bgMusic.volume = volume;
  volumeText.textContent = volumeSlider.value + "%";

  if (volume > 0) {
    bgMusic.muted = false;
    muteBtn.textContent = "🔊";
  }
});

// Mute button click
muteBtn.addEventListener("click", () => {
  bgMusic.muted = !bgMusic.muted;

  if (bgMusic.muted) {
    muteBtn.textContent = "🔇";
  } else {
    muteBtn.textContent = "🔊";
  }
});

const dragonFamilies = {
  Void: {
    icon: "https://www.ditlep.com/Content/Images/Family/dc-ui-family-insignia_void.png",
    ids: [3468,3469,3470,3471,3472,3473]
  },

  Astro: {
    icon: "https://www.ditlep.com/Content/Images/Family/dc-ui-family-insignia_astro.png",
    ids: [3456,3457,3458,3459,3460,3461]
  },

  Risen: {
    icon: "https://www.ditlep.com/Content/Images/Family/gr-family-badge-risen.png",
    ids: [3304,3397,3438,3451,3463,3467]
  },

  Apocalypse: {
    icon: "https://www.ditlep.com/Content/Images/Family/gr-family-badge-apocalypse.png",
    ids: [3419,3420,3421,3448,3449,3450]
  },

  Doom: {
    icon: "https://www.ditlep.com/Content/Images/Family/gr-family-badge-doom.png",
    ids: [3422,3423,3424,3425,3426,3427]
  },

  Armored: {
    icon: "https://www.ditlep.com/Content/Images/Family/gr-family-badge-armor.png",
    ids: [3400,3401,3402,3403,3404,3405]
  },

  Critical: {
    icon: "https://www.ditlep.com/Content/Images/Family/gr-family-badge-critical.png",
    ids: [3373,3374,3376,3380,3381]
  },

  Silencer: {
    icon: "https://www.ditlep.com/Content/Images/Family/icon-silencer.png",
    ids: [3336,3337,3338,3339,3340,3341,3399]
  },

  Evader: {
    icon: "https://www.ditlep.com/Content/Images/Family/gr-family-badge-evader.png",
    ids: [3268,3269,3270,3271,3272,3283]
  },

  Strategist: {
    icon: "https://www.ditlep.com/Content/Images/Family/icon-strategist.png",
    ids: [3263,3264,3265,3266,3267,3273]
  },

  Extractor: {
    icon: "https://www.ditlep.com/Content/Images/Family/gr-family-badge-extractor.png",
    ids: [3241,3242,3244,3245,3270,3278]
  },

  Spiked: {
    icon: "https://www.ditlep.com/Content/Images/Family/icon-spikes.png",
    ids: [3236,3237,3238,3239,3240,3246]
  },

  Guard: {
    icon: "https://www.ditlep.com/Content/Images/Family/gr-family-badge-guard.png",
    ids: [3166,3167,3187,3188,3243]
  },

  Berserker: {
    icon: "https://www.ditlep.com/Content/Images/Family/gr-family-badge-berserker.png",
    ids: [3161,3162,3163,3164,3165,3189]
  },

  Quantum: {
    icon: "https://www.ditlep.com/Content/Images/Family/gr-family-badge-quantum.png",
    ids: [3143,3144,3146,3147,3168]
  },

  Plasma: {
    icon: "https://www.ditlep.com/Content/Images/Family/icon-plasma.png",
    ids: [3148,3156,3157,3158,3159,3160]
  },

  Arcana: {
    icon: "https://www.ditlep.com/Content/Images/Family/gr-family-badge-arcana.png",
    ids: [3025,3039,3053,3067,3095,3123,3137,3141,3145]
  },

  Eternal: {
    icon: "https://www.ditlep.com/Content/Images/Family/icon-eternal.png",
    ids: [3026,3040,3054,3068,3082,3096,3110,3124,3138,3142,3155]
  },

  TWD: {
    icon: "https://www.ditlep.com/Content/Images/Family/icon-twd.png",
    ids: [2955,2969,2970,2984,2998,3012]
  },

  Dual: {
    icon: "https://www.ditlep.com/Content/Images/Family/icon-dual.png",
    ids: [2927,2941]
  },

  Redemption: {
    icon: "https://www.ditlep.com/Content/Images/Family/gr-family-badge-redemption.png",
    ids: [2832,2890,2926,2940,2954,2968,2983,2997,3109]
  },

  Karma: {
    icon: "https://www.ditlep.com/Content/Images/Family/icon4.png",
    ids: [2785,2802,2819,2836,2837,2854,2871,2888,2905,2906,3011]
  },

  Ascended: {
    icon: "https://www.ditlep.com/Content/Images/Family/gr-family-badge-ascended.png",
    ids: [2797,2814,2831,2849,2907,2909,2910,2911,3081]
  },

  Corrupted: {
    icon: "https://www.ditlep.com/Content/Images/Family/gr-family-badge-corrupted.png",
    ids: [2661,2678,2698,2709,2716,2717,2728,2750,2767,2768,2901]
  },

  Vampire: {
    icon: "https://www.ditlep.com/Content/Images/Family/icon2.png",
    ids: [2513,2514,2521,2522,2523,2572,2607,2612,2629,2644,2788]
  },

  Titan: {
    icon: "https://www.ditlep.com/Content/Images/Family/gr-family-badge-titans.png",
    ids: [2379,2380,2381,2462,2463,2484,2487,2488,2605,2736,2737,2738,2739,2740]
  },
};

const activeFamilies = new Set();

function getDragonFamily(id) {
  for (const [familyName, familyData] of Object.entries(dragonFamilies)) {
    if (familyData.ids.includes(Number(id))) {
      return familyName;
    }
  }
  return null;
}

function applyFilters() {
  document.querySelectorAll(".dragon-item").forEach(item => {
    const match = item.textContent.match(/^(\d+)/);
    if (!match) return;
    const dragonId = Number(match[1]);
    const family = getDragonFamily(dragonId);
    if (activeFamilies.size === 0) {
      item.style.display = "";
      return;
    }
    item.style.display =
      activeFamilies.has(family)
        ? ""
        : "none";
  });
}

function getFamilyIcon(dragonId) {
  for (const family of Object.values(dragonFamilies)) {
    if (family.ids.includes(Number(dragonId))) {
      return family.icon;
    }
  }
  return null;
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".dragon-item").forEach(item => {

    const match = item.textContent.match(/^(\d+)/);
    if (!match) return;

    const dragonId = match[1];
    const iconUrl = getFamilyIcon(dragonId);

    if (!iconUrl) return;

    const icon = document.createElement("img");
    icon.src = iconUrl;
    icon.className = "family-icon";

    item.appendChild(icon);
  });
});

const filterContainer =
  document.getElementById("familyFilters");
for (const familyName in dragonFamilies) {
    const btn = document.createElement("button");
    btn.className = "family-icon-btn";
    btn.innerHTML =
      `<img src="${dragonFamilies[familyName].icon}">`;
    btn.title = familyName;
    btn.onclick = () => {
        if (activeFamilies.has(familyName)) {
            activeFamilies.delete(familyName);
            btn.classList.remove("active");
        } else {
            activeFamilies.add(familyName);
            btn.classList.add("active");
        }
        applyFilters();
    };
    filterContainer.appendChild(btn);
}

const clearBtn = document.createElement("button");
clearBtn.className = "family-icon-btn";
clearBtn.innerHTML = "🗑️";
clearBtn.title = "Clear Filters";
clearBtn.onclick = () => {
    activeFamilies.clear();
    document
      .querySelectorAll(".family-icon-btn.active")
      .forEach(btn => btn.classList.remove("active"));
    applyFilters();
};
filterContainer.appendChild(clearBtn);

const toggleBtn =
  document.getElementById("toggleFilters");
const familyModal =
  document.getElementById("familyModal");
toggleBtn.onclick = () => {
    if (familyModal.classList.contains("show")) {
        familyModal.classList.remove("show");
        setTimeout(() => {
            familyModal.classList.add("hidden");
        }, 250);
    } else {
        familyModal.classList.remove("hidden");
        requestAnimationFrame(() => {
            familyModal.classList.add("show");
        });
    }
};

const closeFamilyModal =
  document.getElementById("closeFamilyModal");

closeFamilyModal.onclick = () => {

    familyModal.classList.remove("show");

    setTimeout(() => {
        familyModal.classList.add("hidden");
    }, 250);

};
