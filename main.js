document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('games-container');
  const btn = document.getElementById('generate-btn');

  function getBallClass(num) {
    if (num <= 10) return 'ball-1-10';
    if (num <= 20) return 'ball-11-20';
    if (num <= 30) return 'ball-21-30';
    if (num <= 40) return 'ball-31-40';
    return 'ball-41-45';
  }

  function generateLottoNumbers() {
    const numbers = [];
    while (numbers.length < 6) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    return numbers.sort((a, b) => a - b);
  }

  function renderGames() {
    container.innerHTML = '';
    const gameLabels = ['A', 'B', 'C', 'D', 'E'];

    for (let i = 0; i < 5; i++) {
      const numbers = generateLottoNumbers();
      const row = document.createElement('div');
      row.className = 'game-row';

      const label = document.createElement('span');
      label.className = 'game-label';
      label.textContent = `게임 ${gameLabels[i]}`;
      row.appendChild(label);

      numbers.forEach(num => {
        const ball = document.createElement('div');
        ball.className = `ball ${getBallClass(num)}`;
        ball.textContent = num;
        row.appendChild(ball);
      });

      container.appendChild(row);
    }
  }

  btn.addEventListener('click', renderGames);

  // 초기 생성
  renderGames();
});
