// 다국어 데이터
const i18n = {
  ko: {
    title: "루나의 오늘의 운세",
    subtitle: "신비로운 루나가 당신의 하루를 읽어드립니다.",
    "label-birth": "생년월일을 입력하세요",
    "btn-generate": "운세 보기",
    loading: "운세의 흐름을 읽는 중...",
    "cat-total": "종합 운세",
    "cat-money": "금전운",
    "cat-success": "성공운",
    "cat-love": "애정운",
    "share-title": "행운을 공유하세요",
    fortunes: {
      total: ["오늘은 하늘의 기운이 당신을 향하고 있어요. 새로운 도전을 시작하기에 완벽한 날입니다.", "마음의 여유를 가지세요. 서두르지 않아도 결과는 자연스럽게 따라올 거예요.", "주변 사람들과의 소통이 행운을 가져다줍니다. 밝은 미소로 인사를 건네보세요."],
      money: ["예상치 못한 보너스나 선물이 들어올 수 있는 날입니다. 지갑 관리에 신경 쓰세요.", "지출이 늘어날 수 있는 시기입니다. 꼭 필요한 것인지 한 번 더 생각해보세요.", "투자보다는 저축에 힘써야 할 때입니다. 안정이 최우선이에요."],
      success: ["직장에서 능력을 인정받을 기회가 생깁니다. 자신감을 가지고 임하세요.", "꾸준함이 최고의 무기입니다. 작은 실수가 있더라도 포기하지 마세요.", "창의적인 아이디어가 샘솟는 날입니다. 메모하는 습관을 잊지 마세요."],
      love: ["소중한 사람과 깊은 대화를 나누기 좋은 날입니다. 진심을 전해보세요.", "새로운 인연이 찾아올 예감이 듭니다. 열린 마음으로 사람들을 대하세요.", "상대방의 입장에서 생각하면 갈등이 눈 녹듯 사라질 거예요."]
    }
  },
  en: {
    title: "Luna's Daily Fortune",
    subtitle: "Mystical Luna reads your day.",
    "label-birth": "Enter your birth date",
    "btn-generate": "See Fortune",
    loading: "Reading the flow of stars...",
    "cat-total": "Total Fortune",
    "cat-money": "Wealth",
    "cat-success": "Success",
    "cat-love": "Love",
    "share-title": "Share your luck",
    fortunes: {
      total: ["The stars are aligned in your favor today. Perfect for new challenges.", "Take it easy. Success will come naturally even if you don't rush.", "Communication with others brings luck. Greet everyone with a smile."],
      money: ["Unexpected bonus or gift may arrive. Watch your wallet.", "Expenses might increase. Think twice before purchasing.", "Focus on saving rather than investing. Stability is key."],
      success: ["Opportunities to be recognized at work. Act with confidence.", "Consistency is your best weapon. Don't give up on small mistakes.", "Creative ideas are flowing. Don't forget to take notes."],
      love: ["Good day for deep conversations with loved ones. Express your heart.", "Feeling of a new encounter. Be open-minded.", "Empathy will resolve any conflicts instantly."]
    }
  }
};

let currentLang = 'ko';

// IP 기반 언어 감지 및 초기화
async function initApp() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const countryCode = data.country_code;
    
    // 단순화된 맵핑
    if (countryCode === 'KR') setLanguage('ko');
    else if (countryCode === 'JP') setLanguage('ja'); // 실제 데이터 추가 필요
    else if (countryCode === 'CN') setLanguage('zh'); // 실제 데이터 추가 필요
    else setLanguage('en');
  } catch (e) {
    setLanguage('ko'); // 실패 시 기본 한국어
  }
}

function setLanguage(lang) {
  currentLang = i18n[lang] ? lang : 'en';
  document.getElementById('lang-select').value = currentLang;
  updateUI();
}

function updateUI() {
  const data = i18n[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (data[key]) el.textContent = data[key];
  });
}

// 시드 기반 랜덤 생성 (매일 같은 생일엔 같은 결과)
function getFortune(birthDate) {
  const today = new Date().toISOString().slice(0, 10);
  const seedStr = birthDate + today;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
    hash |= 0;
  }
  
  const absHash = Math.abs(hash);
  const data = i18n[currentLang].fortunes;
  
  return {
    total: data.total[absHash % data.total.length],
    money: data.money[absHash % data.money.length],
    success: data.success[absHash % data.success.length],
    love: data.love[absHash % data.love.length]
  };
}

// 이벤트 리스너
document.getElementById('lang-select').addEventListener('change', (e) => setLanguage(e.target.value));

document.getElementById('get-fortune').addEventListener('click', () => {
  const birthDate = document.getElementById('birth-date').value;
  if (!birthDate) return alert('생년월일을 입력해주세요!');

  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('result-section').classList.add('hidden');

  setTimeout(() => {
    const result = getFortune(birthDate);
    document.getElementById('total-fortune').textContent = result.total;
    document.getElementById('money-fortune').textContent = result.money;
    document.getElementById('success-fortune').textContent = result.success;
    document.getElementById('love-fortune').textContent = result.love;

    document.getElementById('loading').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
  }, 1500);
});

// 공유 기능
window.share = function(platform) {
  const url = window.location.href;
  const text = "루나의 오늘의 운세를 확인해보세요! ✨";
  
  let shareUrl = '';
  switch(platform) {
    case 'kakao': shareUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${url}`; break;
    case 'x': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`; break;
    case 'line': shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`; break;
    // 인스타, 윗쳇은 API 직접 연결이 제한적이므로 클립보드 복사 유도 등 우회 필요
    default: 
      navigator.clipboard.writeText(url).then(() => alert('링크가 복사되었습니다!'));
      return;
  }
  window.open(shareUrl, '_blank');
}

initApp();
