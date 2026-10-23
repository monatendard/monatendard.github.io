// Toast
const toast = document.querySelector("#toast");
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

// Clipboard
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

document.querySelectorAll(".copy").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (target) copyToClipboard(target.textContent.trim(), "복사했습니다.");
  });
});

document.querySelectorAll(".glyph").forEach((button) => {
  button.addEventListener("click", () => {
    copyToClipboard(button.dataset.glyph, `${button.dataset.hex}를 복사했습니다.`);
  });
});

// Theme: 저장된 선택이 없으면 OS 설정을 따른다.
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

function currentTheme() {
  return root.dataset.theme ?? (prefersDark.matches ? "dark" : "light");
}

function syncThemeLabel() {
  const next = currentTheme() === "dark" ? "라이트" : "다크";
  themeToggle?.setAttribute("aria-label", `${next} 모드로 전환`);
}

themeToggle?.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
  syncThemeLabel();
});

prefersDark.addEventListener("change", syncThemeLabel);
syncThemeLabel();

// Hero specimen grid
const gridToggle = document.querySelector("#grid-toggle");
const specimenCode = document.querySelector("#specimen-code");

gridToggle?.addEventListener("change", () => {
  specimenCode?.classList.toggle("show-grid", gridToggle.checked);
});

// Type tester
const tester = document.querySelector("#font-tester");
const lineGutter = document.querySelector("#line-gutter");
const weightControl = document.querySelector("#weight-control");
const sizeControl = document.querySelector("#size-control");
const sizeOutput = document.querySelector("#size-output");
const lineheightControl = document.querySelector("#lineheight-control");
const lineheightOutput = document.querySelector("#lineheight-output");
const linenumbersControl = document.querySelector("#linenumbers-control");
const italicControl = document.querySelector("#italic-control");
const ligatureControl = document.querySelector("#ligature-control");
const presetButtons = document.querySelectorAll(".chip[data-sample]");

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
  table: `| 이름     | role      | 상태   |
|----------|-----------|--------|
| 김하늘   | frontend  | 진행중 |
| Alex Kim | backend   | 완료   |
| 이서준   | design    | 대기   |`,
};

function updateLineGutter() {
  if (!lineGutter || !tester) return;
  const count = Math.max(tester.textContent.split("\n").length, 1);
  const style = window.getComputedStyle(tester);
  lineGutter.innerHTML = Array.from({ length: count }, (_, i) => `<span>${i + 1}</span>`).join("");
  lineGutter.style.fontSize = style.fontSize;
  lineGutter.style.lineHeight = style.lineHeight;
}

document.fonts?.ready.then(updateLineGutter);
updateLineGutter();

tester?.addEventListener("input", updateLineGutter);

weightControl?.addEventListener("change", () => {
  tester.style.fontWeight = weightControl.value;
});

sizeControl?.addEventListener("input", () => {
  const size = `${sizeControl.value}px`;
  tester.style.fontSize = size;
  if (sizeOutput) sizeOutput.value = size;
  updateLineGutter();
});

lineheightControl?.addEventListener("input", () => {
  tester.style.lineHeight = lineheightControl.value;
  if (lineheightOutput) lineheightOutput.value = lineheightControl.value;
  updateLineGutter();
});

linenumbersControl?.addEventListener("change", () => {
  tester.parentElement?.classList.toggle("show-line-numbers", linenumbersControl.checked);
});

italicControl?.addEventListener("change", () => {
  tester.style.fontStyle = italicControl.checked ? "italic" : "normal";
});

ligatureControl?.addEventListener("change", () => {
  tester.style.fontVariantLigatures = ligatureControl.checked ? "contextual" : "none";
  tester.style.fontFeatureSettings = ligatureControl.checked ? "normal" : '"calt" 0, "rlig" 0';
});

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    presetButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    tester.textContent = samples[button.dataset.sample];
    updateLineGutter();
  });
});

// Tabs (WAI-ARIA tabs pattern: 화살표·Home·End로 이동)
document.querySelectorAll("[data-tabs]").forEach((container) => {
  const tabs = Array.from(container.querySelectorAll('[role="tab"]'));

  function activate(tab, moveFocus = false) {
    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute("aria-controls")).hidden = !active;
    });
    if (moveFocus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (event) => {
      const keys = {
        ArrowRight: (index + 1) % tabs.length,
        ArrowLeft: (index - 1 + tabs.length) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      };
      if (event.key in keys) {
        event.preventDefault();
        activate(tabs[keys[event.key]], true);
      }
    });
  });
});

// 헤더 메뉴에 지금 보고 있는 섹션을 표시한다. 화면 가운데 줄에 걸친 섹션이 현재 섹션이다.
const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const spySections = ["top", ...navLinks.map((link) => link.hash.slice(1))]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    });
  },
  { rootMargin: "-50% 0px -50% 0px" },
);

spySections.forEach((section) => spy.observe(section));

// macOS 방문자에게는 설치 탭을 macOS로 먼저 보여 준다.
const platform = navigator.userAgentData?.platform ?? navigator.platform ?? "";
if (/mac/i.test(platform)) document.querySelector("#os-tab-mac")?.click();
