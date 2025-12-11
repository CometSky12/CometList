function generateNameVariants(name) {
  const clean = str => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const lower = name.toLowerCase();
  const words = lower.split(/\s+/);
  const variants = new Set();

  // Original working ones (keeps all old dragons working)
  variants.add(clean(lower));
  if (words.length > 1) {
    variants.add(words.slice(1).join(""));
    variants.add(clean(words[words.length - 1]));
  }

  // NEW: Fix for High Risen, High Marauder, High Realm, etc.
  if (lower.includes("high")) {
    const highIdx = words.indexOf("high");
    if (highIdx !== -1 && highIdx + 1 < words.length) {
      let parts = words.slice(highIdx + 1);
      if (parts[parts.length - 1] === "dragon") parts = parts.slice(0, -1);

      variants.add(parts.join(""));   // highrisenice
      variants.add(parts.join("_"));  // high_risen_ice  ← THIS FIXES YOUR PROBLEM
    }
  }

  // Extra safe fallbacks
  variants.add(lower.replace(/\s+/g, ""));
  variants.add(lower.replace(/\s+/g, "_"));

  return [...variants];
}

function showDragonImages(code, name) {
  const baseUrl = "https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui/dragons/";
  const fallbackUrl = "https://www.socialpointgames.com/static/dragoncity/mobile/ui/dragons/ui_2191_dragon_default_3@2x.png";
  
  const versions = [0, 1, 2, 3];
  const skins = ["", "_skin1", "_skin2", "_skin3"];
  const container = document.getElementById("dragonImages");
  container.innerHTML = "";

  if (code === "9900") code = "2684"; // Autumn fix

  const variants = generateNameVariants(name);

  let totalAttempts = 0;
  let loadedCount = 0;

  // Count how many images we're trying to load
  versions.forEach(v => {
    skins.forEach(skin => {
      if (skin !== "" && v !== 3) return;
      totalAttempts += variants.length;
    });
  });

  // If zero attempts somehow (should never happen), show fallback immediately
  if (totalAttempts === 0) {
    showFallback();
    return;
  }

  // Try loading all possible images
  versions.forEach(v => {
    skins.forEach(skin => {
      if (skin !== "" && v !== 3) return;

      variants.forEach(variant => {
        const img = document.createElement("img");
        img.src = `${baseUrl}ui_${code}_dragon_${variant}${skin}_${v}@2x.png`;

        img.onload = () => {
          loadedCount++;
          container.appendChild(img);
          checkIfAllFailed(); // in case some load later
        };

        img.onerror = () => {
          img.remove();
          loadedCount++;
          checkIfAllFailed();
        };
      });
    });
  });

  // This function checks: if all images failed → show fallback
  function checkIfAllFailed() {
    if (loadedCount >= totalAttempts) {
      // After everything tried and failed
      if (container.children.length === 0) {
        showFallback();
      }
    }
  }

  function showFallback() {
    if (container.children.length > 0) return; // don't show if something already loaded

    const fallbackImg = document.createElement("img");
    fallbackImg.src = fallbackUrl;
    fallbackImg.style.cssText = `
      width: 220px;
      height: 220px;
      border-radius: 20%;
      object-fit: cover;
      background: #2a2a2a;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    `;
    fallbackImg.alt = "Dragon not found - Default Dragon";

    // Optional: add a little text below
    const text = document.createElement("div");
    text.textContent = "Image not found :( Here's a cool dragon anyway!";
    text.style.cssText = "margin-top: 15px; font-size: 14px; color: #888;";

    container.appendChild(fallbackImg);
    container.appendChild(text);
  }

  // Show modal
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


