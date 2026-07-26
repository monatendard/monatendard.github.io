const tester = document.querySelector("#font-tester");
const weightControl = document.querySelector("#weight-control");
const sizeControl = document.querySelector("#size-control");
const sizeOutput = document.querySelector("#size-output");
const italicControl = document.querySelector("#italic-control");
const ligatureControl = document.querySelector("#ligature-control");
const themeButtons = document.querySelectorAll(".theme-button");
const presetButtons = document.querySelectorAll(".preset-button");

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
};

weightControl?.addEventListener("change", (event) => {
  tester.style.fontWeight = event.target.value;
});

sizeControl?.addEventListener("input", (event) => {
  const size = `${event.target.value}px`;
  tester.style.fontSize = size;
  sizeOutput.value = size;
});

italicControl?.addEventListener("change", (event) => {
  tester.style.fontStyle = event.target.checked ? "italic" : "normal";
});

ligatureControl?.addEventListener("change", (event) => {
  const value = event.target.checked ? "contextual" : "none";
  tester.style.fontVariantLigatures = value;
});

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

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    presetButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    tester.textContent = samples[button.dataset.sample];
  });
});

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
