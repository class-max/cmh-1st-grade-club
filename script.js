const reels = [
  document.getElementById('reel1'),
  document.getElementById('reel2'),
  document.getElementById('reel3')
];

const lever = document.getElementById('lever');
const spinSound = document.getElementById('spin-sound');
const winSound = document.getElementById('win-sound');

const symbols = [
  { name: '7', className: 'seven', weight: 0.4 },
  { name: '🎰', weight: 0.1 },
  { name: '🍇', weight: 0.1 },
  { name: '🍊', weight: 0.1 },
  { name: '🍉', weight: 0.1 },
  { name: '🔔', weight: 0.1 },
  { name: '⭐', weight: 0.1 }
];

// 확률 기반 랜덤 선택
function getRandomSymbol() {
  let rand = Math.random();
  let cumulative = 0;
  for (let s of symbols) {
    cumulative += s.weight;
    if (rand < cumulative) return s;
  }
  return symbols[symbols.length - 1];
}

// 슬롯 회전 애니메이션
function spinReels() {
  spinSound.currentTime = 0;
  spinSound.play(); // 회전 시작

  const results = new Array(reels.length);
  let reelsStopped = 0; // 멈춘 릴 개수 카운트

  reels.forEach((reel, idx) => {
    reel.innerHTML = '';
    let interval = 50;
    let count = 20 + Math.floor(Math.random() * 10);
    let current = 0;

    const spinInterval = setInterval(() => {
      reel.innerHTML = '';
      const symbol = getRandomSymbol();
      const div = document.createElement('div');
      div.className = 'item';
      if(symbol.className) div.classList.add(symbol.className);
      div.textContent = symbol.name;
      reel.appendChild(div);

      current++;
      if (current > count) {
        clearInterval(spinInterval);
        results[idx] = symbol.name;
        reelsStopped++; // 멈춘 릴 수 증가

        // 모든 릴이 멈춘 시점에서 한 번만 판단
        if (reelsStopped === reels.length) {
          spinSound.pause(); // 회전 소리 종료
          if (results.every(s => s === '7')) { // 최종 777 체크
            winSound.play();       // 승리 소리
            launchFireworks();     // 폭죽
          }
        }
      }
    }, interval);
  });
}



// 폭죽
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworksArray = [];

function launchFireworks() {
  for (let i = 0; i < 30; i++) {
    fireworksArray.push({
      x: Math.random() * canvas.width / 2,
      y: canvas.height,
      vx: (Math.random() - 0.5) * 10,
      vy: -Math.random() * 15 - 5,
      alpha: 1,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
    fireworksArray.push({
      x: canvas.width/2 + Math.random() * canvas.width / 2,
      y: canvas.height,
      vx: (Math.random() - 0.5) * 10,
      vy: -Math.random() * 15 - 5,
      alpha: 1,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
  }
  animateFireworks();
}

function animateFireworks() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  fireworksArray.forEach((f, idx) => {
    f.x += f.vx;
    f.y += f.vy;
    f.vy += 0.3; // 중력
    f.alpha -= 0.02;
    if (f.alpha <= 0) fireworksArray.splice(idx,1);

    ctx.fillStyle = f.color;
    ctx.globalAlpha = f.alpha;
    ctx.beginPath();
    ctx.arc(f.x,f.y,3,0,Math.PI*2);
    ctx.fill();
  });
  if (fireworksArray.length > 0) requestAnimationFrame(animateFireworks);
}

// 레버 클릭
lever.addEventListener('click', spinReels);
