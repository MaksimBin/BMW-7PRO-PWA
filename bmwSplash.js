// bmwSplash.js
document.addEventListener("DOMContentLoaded", () => {
  const splash = document.createElement("div");
  splash.id = "bmw-splash";
  splash.innerHTML = `
    <div class="bmw-logo">
      <div class="bmw-circle"></div>
      <div class="bmw-text">BMW Player</div>
    </div>
  `;
  document.body.appendChild(splash);
  
  const style = document.createElement("style");
  style.textContent = `
    #bmw-splash {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: radial-gradient(circle at center, #000 60%, #111 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeOut 1s ease forwards;
      animation-delay: 3s;
    }
    .bmw-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: 'Arial Black', sans-serif;
      letter-spacing: 2px;
      text-transform: uppercase;
      animation: zoomIn 1s ease;
    }
    .bmw-circle {
      width: 120px; height: 120px;
      border: 6px solid #0ff; /* акцентный цвет */
      border-radius: 50%;
      margin-bottom: 20px;
      animation: spin 3s linear infinite;
      position: relative;
    }
    .bmw-circle::before,
    .bmw-circle::after {
      content: "";
      position: absolute;
      top: 50%; left: 50%;
      width: 140%; height: 2px;
      background: linear-gradient(90deg, transparent, #0af, transparent);
      transform: translate(-50%, -50%) rotate(0deg);
      animation: lightSweep 3s linear infinite;
    }
    .bmw-circle::after {
      transform: translate(-50%, -50%) rotate(90deg);
    }
    .bmw-text {
      font-size: 2rem;
      color: #0af; /* фирменный синий */
      text-shadow: 0 0 10px #0ff;
    }
    @keyframes zoomIn {
      from { transform: scale(0.5); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes fadeOut {
      to { opacity: 0; visibility: hidden; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes lightSweep {
      from { opacity: 0; }
      50% { opacity: 1; }
: 0; }
    }
  `;
  document.head.appendChild(style);
  
  setTimeout(() => {
    splash.remove();
    style.remove();
  }, 4000);
});