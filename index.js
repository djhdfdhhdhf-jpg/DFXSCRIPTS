// SCRIPT HUB — edit the scripts array below to publish your own entries.
// This is a static GitHub Pages demo. Task completion is self-reported, not verified.
const scripts = [
  {
    id: "universal-demo",
    name: "Universal Script",
    description: "A sample entry for your script collection.",
    game: "Universal",
    rating: "5.0",
    code: `-- Replace this sample with a script you are allowed to share.
print("Welcome to Script Hub!")`,
    tasks: [
      { label: "Subscribe to our YouTube channel", icon: "▶", url: "https://youtube.com/" },
      { label: "Like the video", icon: "👍", url: "https://youtube.com/" },
      { label: "Join our Discord server", icon: "◉", url: "https://discord.com/" }
    ]
  },
  {
    id: "sample-game-script",
    name: "Game Helper Script",
    description: "Another example card — customize or remove it.",
    game: "Sample Game",
    rating: "4.9",
    code: `-- Add your own permitted code here.
print("Hello from Game Helper!")`,
    tasks: [
      { label: "Visit the creator channel", icon: "▶", url: "https://youtube.com/" },
      { label: "Join the community", icon: "◉", url: "https://discord.com/" }
    ]
  }
];

const list = document.getElementById("scriptList");
const modal = document.getElementById("unlockModal");
const taskList = document.getElementById("taskList");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const unlockResult = document.getElementById("unlockResult");
const scriptCode = document.getElementById("scriptCode");
const copyButton = document.getElementById("copyButton");
const toast = document.getElementById("toast");
let activeScript = null;
let completedTasks = new Set();
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function safeText(value) {
  return String(value ?? "");
}

function renderScripts(filter = "") {
  list.replaceChildren();
  const query = filter.trim().toLowerCase();
  const matches = scripts.filter(script =>
    [script.name, script.description, script.game].some(value =>
      safeText(value).toLowerCase().includes(query)
    )
  );

  document.getElementById("availableCount").textContent = scripts.length;

  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No scripts found. Try another search.";
    list.append(empty);
    return;
  }

  matches.forEach(script => {
    const card = document.createElement("article");
    card.className = "script-card";

    const top = document.createElement("div");
    top.className = "card-top";
    const icon = document.createElement("div");
    icon.className = "script-icon";
    icon.textContent = "♛";

    const info = document.createElement("div");
    info.className = "script-info";
    const title = document.createElement("h3");
    title.textContent = script.name;
    const desc = document.createElement("p");
    desc.textContent = script.description;
    const tags = document.createElement("div");
    tags.className = "tag-row";
    const gameTag = document.createElement("span");
    gameTag.className = "tag";
    gameTag.textContent = "🎮 " + script.game;
    const ratingTag = document.createElement("span");
    ratingTag.className = "tag";
    ratingTag.textContent = "★ " + script.rating;
    tags.append(gameTag, ratingTag);
    info.append(title, desc, tags);
    top.append(icon, info);

    const locked = document.createElement("div");
    locked.className = "locked-box";
    const lockedTitle = document.createElement("b");
    lockedTitle.textContent = "🔒 Unlock This Script";
    const lockedDesc = document.createElement("span");
    lockedDesc.textContent = "Complete the tasks below to unlock.";
    locked.append(lockedTitle, lockedDesc);

    const preview = document.createElement("div");
    preview.className = "task-preview";
    script.tasks.slice(0, 3).forEach(task => {
      const row = document.createElement("div");
      row.className = "task-preview-row";
      const taskIcon = document.createElement("b");
      taskIcon.textContent = task.icon;
      const label = document.createElement("span");
      label.textContent = task.label;
      const go = document.createElement("b");
      go.textContent = "Go →";
      row.append(taskIcon, label, go);
      preview.append(row);
    });

    const button = document.createElement("button");
    button.className = "card-unlock";
    button.textContent = "🔒 Unlock Script";
    button.addEventListener("click", () => openUnlock(script));

    card.append(top, locked, preview, button);
    list.append(card);
  });
}

function openUnlock(script) {
  activeScript = script;
  completedTasks = new Set();
  document.getElementById("modalTitle").textContent = "Complete Tasks";
  taskList.replaceChildren();
  unlockResult.hidden = true;
  scriptCode.textContent = "";
  copyButton.textContent = "Copy Script";

  script.tasks.forEach((task, index) => {
    const row = document.createElement("div");
    row.className = "task-row";
    const icon = document.createElement("span");
    icon.className = "task-icon";
    icon.textContent = task.icon;
    const label = document.createElement("span");
    label.textContent = task.label;
    const action = document.createElement("button");
    action.type = "button";
    action.textContent = "Go →";
    const check = document.createElement("span");
    check.className = "task-check";
    check.textContent = "";
    action.addEventListener("click", () => {
      // Open the task destination. The visitor must confirm completion themselves.
      window.open(task.url, "_blank", "noopener,noreferrer");
      if (window.confirm("After completing this task, press OK to mark it complete.")) {
        completedTasks.add(index);
        action.textContent = "Completed";
        action.classList.add("done");
        action.disabled = true;
        check.textContent = "✓";
        updateProgress();
      }
    });
    row.append(icon, label, action, check);
    taskList.append(row);
  });

  updateProgress();
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function updateProgress() {
  const total = activeScript ? activeScript.tasks.length : 0;
  const done = completedTasks.size;
  const percent = total ? (done / total) * 100 : 0;
  progressFill.style.width = percent + "%";
  progressText.textContent = `${done} / ${total}`;

  if (total > 0 && done === total) {
    unlockResult.hidden = false;
    scriptCode.textContent = activeScript.code;
    showToast("All demo tasks marked complete!");
  }
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}
document.getElementById("closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    document.getElementById("searchInput").focus();
  }
});

copyButton.addEventListener("click", async () => {
  if (!activeScript) return;
  try {
    await navigator.clipboard.writeText(activeScript.code);
    copyButton.textContent = "✓ Copied!";
    showToast("Script copied to clipboard.");
  } catch {
    showToast("Clipboard access unavailable. Select and copy the code manually.");
  }
});

document.getElementById("searchInput").addEventListener("input", event => {
  renderScripts(event.target.value);
});
document.getElementById("viewAll").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  renderScripts();
});
document.getElementById("mobileMenu").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});
document.querySelectorAll("[data-view]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-view]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    if (button.dataset.view === "scripts") {
      document.getElementById("scriptsSection").scrollIntoView({ behavior: "smooth" });
    } else if (button.dataset.view === "settings") {
      showToast("Settings panel can be added in a future version.");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    document.getElementById("sidebar").classList.remove("open");
  });
});

renderScripts();
document.getElementById("unlockedCount").textContent = "0";
