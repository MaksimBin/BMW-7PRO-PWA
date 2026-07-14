/* ====== Элементы ====== */
const audio = document.getElementById('audio');
const fileInput = document.getElementById('fileInput');
const loadBtn = document.getElementById('loadBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const eq = document.getElementById('eq');
const trackNameEl = document.getElementById('trackName');
const bmw = document.querySelector('.bmw');
const statusEl = document.getElementById('status');

let playlist = [], current = 0;
let audioCtx, analyser, freqData;
const BARS = 80;
const bars = [];

/* ====== Стили ====== */
const styles = [
  { name: "BMW Blue", b: "#0033A0", m: "#C0C0C0", w: "#C00000", eqBlue: "#0033A0", eqWhite: "#C0C0C0", eqRed: "#C00000", track: "#0033A0" },
  { name: "Obsidian Premium", b: "#0a0a0a", m: "#2e2e2e", w: "#bfbfbf", eqBlue: "#0a0a0a", eqWhite: "#2e2e2e", eqRed: "#bfbfbf", track: "#bfbfbf" },
  { name: "Midnight Blue Steel", b: "#001f3f", m: "#3d3d3d", w: "#ffffff", eqBlue: "#001f3f", eqWhite: "#3d3d3d", eqRed: "#ffffff", track: "#3d3d3d" },
  { name: "Charcoal Mist", b: "#1c1c1c", m: "#3a3a3a", w: "#d9d9d9", eqBlue: "#1c1c1c", eqWhite: "#3a3a3a", eqRed: "#d9d9d9", track: "#3a3a3a" },
  { name: "Velvet Dark", b: "#2a0a2a", m: "#4a4a4a", w: "#ffffff", eqBlue: "#2a0a2a", eqWhite: "#4a4a4a", eqRed: "#ffffff", track: "#4a4a4a" },
  { name: "Ocean Depth", b: "#001f2f", m: "#004f5f", w: "#aee7ff", eqBlue: "#001f2f", eqWhite: "#004f5f", eqRed: "#aee7ff", track: "#004f5f" },
  { name: "Neon Lime", b: "#00FF00", m: "#66FF66", w: "#CCFFCC", eqBlue: "#00FF00", eqWhite: "#66FF66", eqRed: "#CCFFCC", track: "#00FF00" },
  { name: "Cyber Pink", b: "#FF00FF", m: "#FF66FF", w: "#FFD6FF", eqBlue: "#FF00FF", eqWhite: "#FF66FF", eqRed: "#FFD6FF", track: "#FF00FF" },
  { name: "Acid Yellow", b: "#FFFF00", m: "#FFFF66", w: "#FFFFCC", eqBlue: "#FFFF00", eqWhite: "#FFFF66", eqRed: "#FFFFCC", track: "#FFFF00" },
  { name: "Electric Cyan", b: "#00FFFF", m: "#66FFFF", w: "#CCFFFF", eqBlue: "#00FFFF", eqWhite: "#66FFFF", eqRed: "#CCFFFF", track: "#00FFFF" },
  { name: "Laser Red", b: "#FF0000", m: "#FF6666", w: "#FFCCCC", eqBlue: "#FF0000", eqWhite: "#FF6666", eqRed: "#FFCCCC", track: "#FF0000" }
];
let styleIndex = 0;

/* ====== Фоны ====== */
const backgrounds = [
  "linear-gradient(180deg,#111,#333)",
  "radial-gradient(circle at 30% 20%, rgba(0,51,160,0.18), transparent 25%), linear-gradient(180deg,#000,#071428)",
  "linear-gradient(180deg,#0b0b0b 0%, #1a1a1a 40%, #3a2b0a 100%)",
  "linear-gradient(180deg,#0a0a0a 0%, #111 50%, #0a0a0a 100%), radial-gradient(circle at 50% 10%, rgba(255,215,0,0.06), transparent 20%)",
  "repeating-linear-gradient(45deg,#0b0b0b 0 8px,#141414 8px 16px)",
  "linear-gradient(180deg,#020202 0%, #0f1720 60%)",
  "radial-gradient(circle at 70% 10%, rgba(255,255,255,0.04), transparent 15%), linear-gradient(180deg,#0b0b0b,#1b1b1b)",
  "linear-gradient(135deg,#0f0f0f 0%, #2b2b2b 50%, #0f0f0f 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 6px)",
  "linear-gradient(180deg,#001219 0%, #001e2b 60%, #000 100%)",
  "linear-gradient(180deg,#0a0a0a 60%,#111 100%)"
];
let bgIndex = 0;

/* ====== Создание баров ====== */
for(let i=0;i<BARS;i++){
  const bar = document.createElement('div');
  bar.className = 'bar';
  eq.appendChild(bar);
  bars.push(bar);
}

/* ====== Вспомогательные функции для динамического текста ====== */
function luminance(hex){
  if(!hex) return 0;
  const c = hex.replace('#','');
  const r = parseInt(c.substring(0,2),16);
  const g = parseInt(c.substring(2,4),16);
  const b = parseInt(c.substring(4,6),16);
  return 0.299*r + 0.587*g + 0.114*b;
}
function makeTrackGradient(s){
  const c1 = s.eqBlue || s.b;
  const c2 = s.eqWhite || s.m;
  const c3 = s.eqRed || s.w;
  return `linear-gradient(90deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
}

/* ====== Применение стиля и фона ====== */
function applyStyle(){
  const s = styles[styleIndex];
  if(bmw){
    const bEl = bmw.querySelector('.b');
    const mEl = bmw.querySelector('.m');
    const wEl = bmw.querySelector('.w');
    if(bEl) bEl.style.color = s.b;
    if(mEl) mEl.style.color = s.m;
    if(wEl) wEl.style.color = s.w;
  }
  bars.forEach((bar,i)=>{
    if(i < BARS/3) bar.style.background = s.eqBlue;
    else if(i < 2*BARS/3) bar.style.background = s.eqWhite;
    else bar.style.background = s.eqRed;
  });
  if(trackNameEl){
    const grad = makeTrackGradient(s);
    trackNameEl.style.backgroundImage = grad;
    trackNameEl.style.webkitBackgroundClip = 'text';
    trackNameEl.style.backgroundClip = 'text';
    trackNameEl.style.webkitTextFillColor = 'transparent';
    trackNameEl.style.color = 'transparent';
    const cols = [s.eqBlue || s.b, s.eqWhite || s.m, s.eqRed || s.w];
    const avgLum = Math.round((luminance(cols[0]) + luminance(cols[1]) + luminance(cols[2])) / 3);
    if(avgLum < 90){
      trackNameEl.style.textShadow = '0 1px 0 rgba(0,0,0,0.6), 0 8px 22px rgba(0,0,0,0.45), 0 0 18px rgba(255,255,255,0.08)';
    } else if(avgLum < 160){
      trackNameEl.style.textShadow = '0 1px 0 rgba(0,0,0,0.55), 0 8px 20px rgba(0,0,0,0.38), 0 0 14px rgba(255,255,255,0.06)';
    } else {
      trackNameEl.style.textShadow = '0 1px 0 rgba(255,255,255,0.85), 0 6px 18px rgba(0,0,0,0.12)';
    }

    // Увеличенный шрифт и адаптивность (оставляем управление через CSS, но гарантируем значение)
    trackNameEl.style.fontSize = 'clamp(16px, 3.2vw, 22px)';

    // Класс для короткой анимации появления
    trackNameEl.classList.add('show');
    clearTimeout(trackNameEl._showTimer);
    trackNameEl._showTimer = setTimeout(()=> trackNameEl.classList.remove('show'), 900);
  }
  if(statusEl) statusEl.textContent = `Стиль: ${s.name}`;
}
function applyBackground(){
  document.body.style.background = backgrounds[bgIndex];
  if(statusEl) statusEl.textContent = `Фон: ${bgIndex+1}/${backgrounds.length}`;
}
applyStyle();
applyBackground();

/* ====== Audio setup ====== */
function initAudio(){
  if(audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  freqData = new Uint8Array(analyser.frequencyBinCount);
  const source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  requestAnimationFrame(updateEq); // запуск один раз
}

/* ====== Play / UI ====== */
function playTrack(index){
  if(!playlist.length) return;
  current = (index + playlist.length) % playlist.length;
  const file = playlist[current];
  audio.src = URL.createObjectURL(file);
  showTrackName(file.name);
  if(!audioCtx) initAudio();
  if(audioCtx.state === 'suspended') audioCtx.resume();
  audio.play().catch(()=>{});
}
let nameTimer = null;
function showTrackName(name){
  if(!trackNameEl) return;
  trackNameEl.textContent = name;

  // сброс классов
  trackNameEl.classList.remove('hide');
  void trackNameEl.offsetWidth; // форсируем перерисовку

  // плавное появление
  trackNameEl.classList.add('show');

  if(nameTimer) clearTimeout(nameTimer);
  nameTimer = setTimeout(()=>{
    trackNameEl.classList.remove('show');
    trackNameEl.classList.add('hide');
  }, 5000); // держим дольше и исчезаем плавно
}
function updateEq(){
  requestAnimationFrame(updateEq);
  if(!analyser) return;
  analyser.getByteFrequencyData(freqData);
  bars.forEach((bar,i)=>{
    const raw = freqData[Math.floor(i * freqData.length / BARS)];
    const h = Math.max(4, Math.round(raw / 2.5));
    bar.style.height = h + 'px';
  });
}

/* ====== Controls ====== */
loadBtn.addEventListener('click', ()=> fileInput.click());
fileInput.addEventListener('change', (e)=>{
  playlist = Array.from(e.target.files || []);
  if(playlist.length){
    loadBtn.style.display = 'none';
    playTrack(0);
  }
});
audio.addEventListener('ended', ()=> {
  if(playlist.length){ current = (current + 1) % playlist.length; playTrack(current); }
});
fullscreenBtn.addEventListener('click', ()=> {
  if(!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
});

/* ====== Touch: свайпы и тап (включая свайп вверх для смены фона) ====== */
let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
let swiped = false;
let lastTap = 0;

eq.addEventListener('touchstart', e=>{
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
  touchStartTime = Date.now();
  swiped = false;
}, {passive:true});

eq.addEventListener('touchmove', e=>{
  if(swiped || !playlist.length) return;
  const t = e.touches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;

  // Горизонтальный свайп — переключение треков (порог 30px)
  if(Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)){
    if(dx > 0) current = (current + 1) % playlist.length;
    else current = (current - 1 + playlist.length) % playlist.length;
    playTrack(current);
    swiped = true;
    return;
  }

  // Вертикальный свайп вверх — смена фона (порог 40px)
  if(dy < -40 && Math.abs(dy) > Math.abs(dx)){
    bgIndex = (bgIndex + 1) % backgrounds.length;
    applyBackground();
    swiped = true;
    return;
  }
}, {passive:true});

eq.addEventListener('touchend', e=>{
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;
  const dt = Date.now() - touchStartTime;

  // Короткий тап — play/pause
  if(!swiped && dt < 300 && Math.abs(dx) < 20 && Math.abs(dy) < 20){
    // Обработка двойного тапа для смены стиля
    const now = Date.now();
    if(now - lastTap < 350){
      styleIndex = (styleIndex + 1) % styles.length;
      applyStyle();
      lastTap = 0;
      return;
    } else {
      lastTap = now;
    }

    if(!audio.src && playlist.length) playTrack(0);
    else if(audio.paused) audio.play();
    else audio.pause();
  }
}, {passive:true});

/* ====== Double click / double tap — смена стиля (desktop dblclick kept) */
document.body.addEventListener('dblclick', ()=>{
  styleIndex = (styleIndex + 1) % styles.length;
  applyStyle();
});

/* ====== Keyboard shortcuts (optional) ====== */
document.addEventListener('keydown', e=>{
  if(e.code === 'Space'){ e.preventDefault(); if(audio.paused) audio.play(); else audio.pause(); }
  if(e.code === 'ArrowRight' && playlist.length){ current = (current + 1) % playlist.length; playTrack(current); }
  if(e.code === 'ArrowLeft' && playlist.length){ current = (current - 1 + playlist.length) % playlist.length; playTrack(current); }
  if(e.code === 'KeyS'){ styleIndex = (styleIndex + 1) % styles.length; applyStyle(); } // S — style
  if(e.code === 'KeyF'){ bgIndex = (bgIndex + 1) % backgrounds.length; applyBackground(); } // F — фон
});

/* ====== Инициализация ====== */
if(statusEl) statusEl.textContent = 'Version5_pro — готово. Двойной клик: стиль. Свайп вверх: фон.';

if ('mediaSession' in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'BMW Player',
    artist: 'BMW Audio',
    album: 'BMW Visualizer',
    artwork: [
      { src: 'icon-192.png', sizes: '512x512', type: 'image/png' }
    ]
  });
  
  navigator.mediaSession.setActionHandler('play', () => {
    audio.play();
  });
  navigator.mediaSession.setActionHandler('pause', () => {
    audio.pause();
  });
  navigator.mediaSession.setActionHandler('nexttrack', () => {
    playTrack(current + 1)
  });
  navigator.mediaSession.setActionHandler('previoustrack', () => {
    playTrack(current - 1)
  });
}