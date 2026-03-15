const STEAM_API = 'https://store.steampowered.com/api/featuredcategories/?cc=kr&l=koreana';

const PROXIES = [
  url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

let steamData = null;
let currentTab = 'specials';

async function fetchWithProxy(url) {
  for (const makeProxy of PROXIES) {
    try {
      const res = await fetch(makeProxy(url), {
        signal: AbortSignal.timeout(10000)
      });
      if (!res.ok) continue;
      const data = await res.json();
      return data;
    } catch (e) {
      continue;
    }
  }
  throw new Error('Steam 데이터를 불러올 수 없습니다.');
}

async function loadSteamData() {
  const loading = document.getElementById('loadingState');
  const error = document.getElementById('errorState');
  const grid = document.getElementById('gamesGrid');

  loading.style.display = 'flex';
  error.style.display = 'none';
  grid.style.display = 'none';

  try {
    steamData = await fetchWithProxy(STEAM_API);
    loading.style.display = 'none';
    grid.style.display = 'grid';
    renderTab(currentTab);
  } catch (e) {
    loading.style.display = 'none';
    error.style.display = 'flex';
  }
}

function formatPrice(price) {
  if (price === 0) return '<span class="final-price is-free">무료</span>';
  return `₩${price.toLocaleString('ko-KR')}`;
}

function renderPlatforms(item) {
  const icons = [];
  if (item.windows_available) icons.push('🪟');
  if (item.mac_available) icons.push('🍎');
  if (item.linux_available) icons.push('🐧');
  return icons.length ? `<div class="platform-icons">${icons.join(' ')}</div>` : '';
}

function renderTab(tab) {
  currentTab = tab;
  const grid = document.getElementById('gamesGrid');

  if (!steamData || !steamData[tab] || !steamData[tab].items) {
    grid.innerHTML = '<p class="no-data">데이터가 없습니다.</p>';
    return;
  }

  let items = [...steamData[tab].items];

  // 할인 탭: 할인율 높은 순 정렬
  if (tab === 'specials') {
    items.sort((a, b) => b.discount_percent - a.discount_percent);
  }

  grid.innerHTML = items.map(item => {
    const appUrl = `https://store.steampowered.com/app/${item.id}/`;
    const imgUrl = item.header_image ||
      `https://cdn.akamai.steamstatic.com/steam/apps/${item.id}/header.jpg`;
    const isFree = item.final_price === 0 && item.discount_percent === 0;
    const isDiscounted = item.discount_percent > 0;

    return `
      <a class="game-card" href="${appUrl}" target="_blank" rel="noopener">
        <div class="card-image">
          <img
            src="${imgUrl}"
            alt="${item.name}"
            loading="lazy"
            onerror="this.style.background='#2A475E';this.removeAttribute('src')"
          >
          ${isDiscounted ? `<span class="discount-badge">-${item.discount_percent}%</span>` : ''}
          ${isFree ? '<span class="free-badge">무료</span>' : ''}
        </div>
        <div class="card-info">
          <h3 class="game-name">${item.name}</h3>
          <div class="price-wrap">
            ${isDiscounted
              ? `<span class="original-price">${formatPrice(item.original_price)}</span>
                 <span class="final-price">${formatPrice(item.final_price)}</span>`
              : isFree
              ? '<span class="final-price is-free">무료</span>'
              : `<span class="final-price" style="color:var(--text)">${formatPrice(item.final_price)}</span>`
            }
          </div>
          ${renderPlatforms(item)}
        </div>
      </a>
    `;
  }).join('');
}

// 탭 전환
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTab(btn.dataset.tab);
  });
});

// 초기 로드
loadSteamData();
