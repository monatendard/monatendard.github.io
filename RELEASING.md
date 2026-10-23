# 릴리스 반영 절차

릴리스마다 바뀌는 값은 `index.html`의 **설치 섹션(`#install`)** 과 Hero의 버전 표기에만 있습니다.

1. 릴리스 Web ZIP의 `fonts/*.woff2` 14개를 `assets/fonts/`에 덮어씁니다.
2. `index.html`에서 이전 버전 문자열(예: `v0.3.0`)을 새 버전으로 모두 바꿉니다.
   다운로드 링크 4개(ZIP 3개, `SHA256SUMS.txt`), Hero의 `hero-meta`, 설치 섹션 머리말이 여기에 해당합니다.
3. 다운로드 크기 3개를 바꿉니다. GitHub 릴리스 화면과 같은 MiB 기준, 소수 첫째 자리입니다.
   ```sh
   gh release view vX.Y.Z -R younjungpark/Monatendard --json assets -q '.assets[] | "\(.name) \(.size/1048576*10|round/10)"'
   ```
4. SHA256 3개를 `SHA256SUMS.txt`와 맞춥니다.
   ```sh
   gh release download vX.Y.Z -R younjungpark/Monatendard -p SHA256SUMS.txt -O -
   ```
5. 영문 셀 폭, 기반 글꼴 버전, Nerd 아이콘 수가 바뀌었다면 설계 섹션과 `spec-list`도 고칩니다.
6. `README.md`의 버전을 바꾸고 main에 푸시합니다. 1분 안에 GitHub Pages에 배포됩니다.

## OG 이미지 다시 만들기

원본은 `assets/og/og.html`입니다. 저장소 폴더에서 `python -m http.server 8765`를 켠 뒤 찍습니다.

```sh
chrome --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 \
  --virtual-time-budget=8000 --screenshot=assets/og-image.png http://localhost:8765/assets/og/og.html
```

이미지를 바꾼 뒤에는 `index.html`의 `og:image`, `twitter:image` 주소 끝 `?v=` 숫자를 하나 올립니다.
LinkedIn·카카오톡 같은 서비스는 이미지를 URL 기준으로 캐시해서, 주소가 같으면 예전 이미지를 계속 보여 줍니다.
