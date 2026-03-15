# SteamKit 프로젝트 지침

## 프로젝트 개요
- **사이트명:** SteamKit
- **URL:** https://steamkit.wooahouse.com
- **GitHub:** https://github.com/ingmaster83-code/SteamKit
- **배포:** GitHub Pages (main 브랜치 → root)
- **도메인 관리:** 호스팅케이알
- **DNS:** steamkit CNAME → ingmaster83-code.github.io

## 기술 스택
- 순수 HTML / CSS / JS (프레임워크 없음)
- Steam Store API (CORS 프록시 경유: corsproxy.io → allorigins.win 폴백)
- PWA: manifest.json + sw.js + js/pwa-install.js

## 서비스 목적
Steam Store API를 실시간으로 호출해 할인 게임, 인기 순위, 신규 출시 게임을
카드 형태로 보여주는 서비스. 클릭 시 Steam 스토어 페이지로 이동.

## 파일 구조
```
SteamKit/
├── index.html          # 메인 (탭: 특가할인 / 인기판매 / 신규출시)
├── about.html
├── privacy.html
├── css/style.css       # Steam 다크 테마 (#1B2838)
├── js/steam.js         # Steam API fetch + 렌더링 로직
├── js/pwa-install.js   # PWA 설치 유도
├── manifest.json
├── sw.js               # 네트워크 우선 서비스 워커
├── icons/icon.svg
├── robots.txt
├── sitemap.xml
└── CNAME               # steamkit.wooahouse.com
```

## Steam API
- 엔드포인트: `https://store.steampowered.com/api/featuredcategories/?cc=kr&l=koreana`
- 탭별 키: `specials` (할인) / `top_sellers` (인기) / `new_releases` (신규)
- 가격: KRW 기준, `final_price` / `original_price` 필드 사용
- 이미지: `header_image` 필드 또는 CDN 패턴 `cdn.akamai.steamstatic.com/steam/apps/{id}/header.jpg`
- 게임 링크: `https://store.steampowered.com/app/{id}/`

## 작업 규칙
- Steam과 공식 제휴 없음 명시 유지 (footer disclaimer)
- 새 탭/기능 추가 시 sitemap.xml 업데이트
- SEO 키워드: 스팀 할인, Steam 세일, 스팀 인기 게임, 게임 할인 정보
