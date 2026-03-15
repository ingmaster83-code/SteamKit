const INSTALL_KEY = 'steamkit-install-dismissed';
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
});

// 히어로 설치 버튼
const heroBtn = document.getElementById('heroInstallBtn');
if (heroBtn) {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    heroBtn.style.display = 'none';
  }
  heroBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (outcome === 'accepted') heroBtn.style.display = 'none';
    } else {
      alert('주소창의 설치 아이콘을 클릭하거나,\n브라우저 메뉴 → "홈 화면에 추가"를 선택해주세요.');
    }
  });
}

// 하단 배너 (3초 후)
if (!sessionStorage.getItem(INSTALL_KEY) &&
    !window.matchMedia('(display-mode: standalone)').matches) {
  setTimeout(() => {
    if (!deferredPrompt) return;
    const banner = document.createElement('div');
    banner.className = 'pwa-banner';
    banner.innerHTML = `
      <div class="pwa-banner-content">
        <img src="icons/icon.svg" width="40" height="40" alt="SteamKit">
        <div>
          <strong>SteamKit</strong>
          <span>홈 화면에 추가하고 빠르게 접속하세요</span>
        </div>
        <button class="pwa-install-btn" id="bannerInstallBtn">설치</button>
        <button class="pwa-close-btn" id="bannerCloseBtn">✕</button>
      </div>
    `;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('show'));

    document.getElementById('bannerInstallBtn').addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
      }
      banner.remove();
    });

    document.getElementById('bannerCloseBtn').addEventListener('click', () => {
      sessionStorage.setItem(INSTALL_KEY, '1');
      banner.remove();
    });
  }, 3000);
}

// 서비스 워커 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
