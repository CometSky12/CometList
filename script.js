let currentDragonId = null;

/* ================================
   NAME VARIANTS
================================ */

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
