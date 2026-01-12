// Also update generateNameVariants to handle "blood god vampire" better
function generateNameVariants(name) {
  const clean = str => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const lower = name.toLowerCase();
  const words = lower.split(/\s+/);
  const variants = new Set();
  
  // Original working ones
  variants.add(clean(lower));
  if (words.length > 1) {
    variants.add(words.slice(1).join(""));
    variants.add(clean(words[words.length - 1]));
  }
  
  // THIS IS THE MAGIC THAT FIXED HIGH RISEN ICE AND ALL HIGH DRAGONS
  if (lower.includes("high")) {
    const highIdx = words.indexOf("high");
    if (highIdx !== -1 && highIdx + 1 < words.length) {
      let parts = words.slice(highIdx + 1);
      if (parts[parts.length - 1] === "dragon") parts = parts.slice(0, -1);
      variants.add(parts.join("")); // highrisenice
      variants.add(parts.join("_")); // high_risen_ice ← THIS ONE FIXED IT
    }
  }
  
  // NEW: Special handling for multi-word names like "blood god vampire"
  // Try all possible camelCase combinations
  if (words.length >= 3) {
    variants.add(words.slice(0, 2).join("")); // bloodgod
    variants.add(words.slice(0, -1).join("")); // bloodgodvampire (without "dragon")
    variants.add(words.slice(-2).join("")); // godvampire
    variants.add(words[0] + words.slice(1).join("")); // bloodgodvampire
  }
  
  // Extra safe fallbacks
  variants.add(lower.replace(/\s+/g, ""));
  variants.add(lower.replace(/\s+/g, "_"));
  return [...variants];
}

function showDragonImages(code, name) {
  const baseUrl = "https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui/dragons/";
  const versions = [0, 1, 2, 3];
  const skins = ["", "_skin1", "_skin2", "_skin3", "_skin_1", "_skin_2", "_skin_3"];
  const suffixes = ["", "_a", "_b", "_c", "_d", "_e", "_f", "_g", "_h"];
  
  // Special overrides for specific dragon codes
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
    "3421": "highwar"
  };
  
  const container = document.getElementById("dragonImages");
  container.innerHTML = "";
 
  if (code === "9900") code = "2684"; // Autumn fix
  if (code === "1033") code = "3140";
  if (code === "1113") code = "1020";
  if (code === "1114") code = "1023";
  if (code === "1142") code = "1020";  
  
  let variants;
  if (codeOverrides[code]) {
    // Use special override variant ONLY for these codes
    variants = [codeOverrides[code]];
  } else {
    // Normal name variants for all other dragons
    variants = generateNameVariants(name);
  }
  
  versions.forEach(v => {
    suffixes.forEach(suffix => {
      skins.forEach(skin => {
        // Skins only on adult (v=3), empty skin on all stages
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
  
  const modal = document.getElementById("dragonModal");
  modal.style.display = "block";
  setTimeout(() => modal.classList.add("show"), 10);
}

function closeModal() {
  const modal = document.getElementById("dragonModal");
  modal.classList.remove("show");
  setTimeout(() => (modal.style.display = "none"), 400);
}

document.querySelectorAll(".dragon-item").forEach(item => {
  item.addEventListener("click", () => {
    const text = item.textContent.trim();
    const match = text.match(/^(\d+)\s*-\s*(.+?)(?:\s*Dragon)?$/i);
    if (match) {
      const code = match[1];
      const name = match[2];
      showDragonImages(code, name);
    }
  });
});

function filterDragons() {
  const input = document.getElementById("search").value.toLowerCase();
  document.querySelectorAll(".dragon-item").forEach(item => {
    if (input === "" || item.textContent.toLowerCase().includes(input)) {
      item.style.display = "block";
      item.classList.remove("hideDragon");
      item.classList.add("showDragon");
    } else {
      item.classList.remove("showDragon");
      item.classList.add("hideDragon");
      setTimeout(() => (item.style.display = "none"), 400);
    }
  });
}

document.addEventListener("click", () => {
  const bgMusic = document.getElementById("bgMusic");
  bgMusic.play().catch(() => {});
}, { once: true });
















