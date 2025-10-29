function generateNameVariants(name) {
  let base = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  let variants = [base];
  const words = name.toLowerCase().split(/\s+/);
  if (words.length > 1) {
    variants.push(words.slice(1).join("").replace(/[^a-z0-9]/g, ""));
    variants.push(words[words.length - 1].replace(/[^a-z0-9]/g, ""));
  }
  return [...new Set(variants)];
}

function showDragonImages(code, name) {
  const baseUrl = "https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui/dragons/";
  const versions = [0, 1, 2, 3];
  const skins = ["", "_skin1", "_skin2", "_skin3"];
  const container = document.getElementById("dragonImages");
  container.innerHTML = "";

  if (code === "9900") code = "2684"; // Autumn fix
  const variants = generateNameVariants(name);

  versions.forEach(v => {
    skins.forEach(skin => {
      if (skin !== "" && v !== 3) return;
      variants.forEach(variant => {
        const img = document.createElement("img");
        img.src = `${baseUrl}ui_${code}_dragon_${variant}${skin}_${v}@2x.png`;
        img.onerror = () => img.remove();
        container.appendChild(img);
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
