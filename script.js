// DOM Elements
const tester = document.querySelector("#font-tester");
const weightControl = document.querySelector("#weight-control");
const sizeControl = document.querySelector("#size-control");
const sizeOutput = document.querySelector("#size-output");
const lineheightControl = document.querySelector("#lineheight-control");
const lineheightOutput = document.querySelector("#lineheight-output");
const linenumbersControl = document.querySelector("#linenumbers-control");
const italicControl = document.querySelector("#italic-control");
const ligatureControl = document.querySelector("#ligature-control");
const themeButtons = document.querySelectorAll(".theme-button");
const presetButtons = document.querySelectorAll(".preset-button");
const toast = document.querySelector("#toast");

// Toast Message Function
let toastTimer = null;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

// Preset Sample Texts
const samples = {
  code: `public User 사용자조회(String userId) {
    // 데이터베이스에서 사용자 정보를 불러옵니다.
    if (connection == null) {
        throw new IllegalStateException("연결 정보를 확인하세요.");
    }
    return repository.findById(userId);
}`,
  korean: `한글과 English가 섞인 source comment
넓은 영문과 자연스러운 한글이 같은 리듬으로 이어집니다.
가각간갇갈감갑값같꿇뷁힣
AA가  AA한글  ABC  0123456789`,
  ligature: `!=  !==  ===  =>  ->  <=  >=  ::  ...
if (상태 === "완료") return "성공";
const transform = input => output;
range.start <= value && value >= range.end;`,
  nerd: `\uE0A0 main  \uE0B0  ~/Monatendard  \uE0B0  git status
\uE0A1 line:42  \uE0A2 lock:secured  \uE0A3 col:18  \uE0B1 v0.2.2
Powerline & Editor symbols · U+E0A0–U+E0D4`,
};

// Line Gutter Generator
const lineGutter = document.querySelector("#line-gutter");

function updateLineGutter() {
  if (!lineGutter || !tester) return;
  const lines = tester.textContent.split("\n");
  const testerStyle = window.getComputedStyle(tester);
  let html = "";
  for (let i = 1; i <= Math.max(lines.length, 1); i++) {
    const num = i < 10 ? `0${i}` : `${i}`;
    html += `<span>${num}</span>`;
  }
  lineGutter.innerHTML = html;
  lineGutter.style.lineHeight = testerStyle.lineHeight;
  lineGutter.style.fontSize = testerStyle.fontSize;
}

// Initial Call
document.addEventListener("DOMContentLoaded", updateLineGutter);
setTimeout(updateLineGutter, 50);

// Font Tester Event Handlers
weightControl?.addEventListener("change", (event) => {
  tester.style.fontWeight = event.target.value;
});

sizeControl?.addEventListener("input", (event) => {
  const size = `${event.target.value}px`;
  tester.style.fontSize = size;
  if (sizeOutput) sizeOutput.value = size;
  updateLineGutter();
});

lineheightControl?.addEventListener("input", (event) => {
  const val = event.target.value;
  tester.style.lineHeight = val;
  if (lineheightOutput) lineheightOutput.value = val;
  updateLineGutter();
});

tester?.addEventListener("input", updateLineGutter);
tester?.addEventListener("keyup", updateLineGutter);

linenumbersControl?.addEventListener("change", (event) => {
  const wrapper = tester.parentElement;
  if (wrapper) {
    wrapper.classList.toggle("show-line-numbers", event.target.checked);
  }
});

italicControl?.addEventListener("change", (event) => {
  tester.style.fontStyle = event.target.checked ? "italic" : "normal";
});

ligatureControl?.addEventListener("change", (event) => {
  tester.style.fontVariantLigatures = event.target.checked ? "contextual" : "none";
  tester.style.fontFeatureSettings = event.target.checked ? "normal" : '"rlig" 0';
});

// Theme Switcher
themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    themeButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    tester.dataset.theme = button.dataset.themeValue;
  });
});

// Preset Buttons
presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    presetButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    const sampleKey = button.dataset.sample;
    tester.textContent = samples[sampleKey];
    updateLineGutter();
  });
});

// Quick Setup Tabs
const setupTabs = document.querySelectorAll(".setup-tab");
const setupPanels = document.querySelectorAll(".setup-panel");
const setupTabList = Array.from(setupTabs);

function activateSetupTab(activeTab, moveFocus = false) {
  const targetTab = activeTab.dataset.tab;

  setupTabList.forEach((tab) => {
    const active = tab === activeTab;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  setupPanels.forEach((panel) => {
    const active = panel.id === `tab-${targetTab}`;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });

  if (moveFocus) activeTab.focus();
}

setupTabList.forEach((tab, index) => {
  tab.addEventListener("click", () => activateSetupTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex = null;

    if (event.key === "ArrowRight") nextIndex = (index + 1) % setupTabList.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + setupTabList.length) % setupTabList.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = setupTabList.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      activateSetupTab(setupTabList[nextIndex], true);
    }
  });
});

const initialSetupTab = setupTabList.find((tab) => tab.classList.contains("is-active"));
if (initialSetupTab) activateSetupTab(initialSetupTab);

// Clipboard Copy Functionality
async function copyToClipboard(text, successMsg) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
    await navigator.clipboard.writeText(text);
    showToast(successMsg);
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textArea);
    showToast(copied ? successMsg : "복사하지 못했습니다. 다시 시도해 주세요.");
  }
}

// Copy Code Snippet Buttons
document.querySelectorAll(".copy-code-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.copyTarget;
    const codeEl = document.getElementById(targetId);
    if (codeEl) {
      copyToClipboard(codeEl.textContent.trim(), "에디터 설정 코드가 복사되었습니다!");
    }
  });
});

// Copy Checksum Button
const copyChecksumBtn = document.querySelector("#copy-checksum-btn");
copyChecksumBtn?.addEventListener("click", () => {
  const checksum = copyChecksumBtn.dataset.checksum;
  copyToClipboard(checksum, "SHA256 체크섬이 복사되었습니다!");
});

// Nerd Icons Grid Copy
document.querySelectorAll(".icon-card").forEach((card) => {
  card.addEventListener("click", () => {
    const glyph = card.dataset.glyph;
    const hex = card.dataset.hex;
    copyToClipboard(glyph, `Powerline 글리프 (${hex})가 복사되었습니다!`);
  });
});

// Reveal Animation Observer
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// Scroll Cue & Background Shift Effect
let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--scroll-shift",
          String(Math.min(window.scrollY * 0.08, 80)),
        );
        ticking = false;
      });
      ticking = true;
    }
  },
  { passive: true },
);

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const siteNav = document.querySelector("#site-nav");

function toggleMobileMenu(forceClose = false) {
  if (!mobileMenuToggle || !siteNav) return;

  const isOpen = siteNav.classList.contains("is-open");
  const shouldClose = forceClose || isOpen;

  siteNav.classList.toggle("is-open", !shouldClose);
  mobileMenuToggle.setAttribute("aria-expanded", String(!shouldClose));
  mobileMenuToggle.setAttribute("aria-label", shouldClose ? "메뉴 열기" : "메뉴 닫기");
  document.body.style.overflow = shouldClose ? "" : "hidden";
}

mobileMenuToggle?.addEventListener("click", () => toggleMobileMenu());

// Close menu when a nav link is clicked
siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (siteNav.classList.contains("is-open")) {
      toggleMobileMenu(true);
    }
  });
});

// Close menu on Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav?.classList.contains("is-open")) {
    toggleMobileMenu(true);
    mobileMenuToggle?.focus();
  }
});
