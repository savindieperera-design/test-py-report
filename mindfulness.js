// ====== Hamburger Menu ======
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const sleep = ms => new Promise(res => setTimeout(res, ms));

  // ---------- BREATHING ----------
  const breathingText = document.getElementById('breathingText');
  const circle = document.querySelector('.circle');
  const startBreathingBtn = document.getElementById('startBreathing');
  const stopBreathingBtn = document.getElementById('stopBreathing');

  let running = false;
  let loopRunning = false;

  async function breathingLoop() {
    if (loopRunning) return;
    loopRunning = true;
    while (running) {
      breathingText.textContent = 'Breathe In...';
      circle.classList.add('breathe-in');
      circle.classList.remove('breathe-out');
      await sleep(4000);

      if (!running) break;
      breathingText.textContent = 'Hold...';
      await sleep(2000);

      if (!running) break;
      breathingText.textContent = 'Breathe Out...';
      circle.classList.remove('breathe-in');
      circle.classList.add('breathe-out');
      await sleep(4000);

      if (!running) break;
      breathingText.textContent = 'Hold...';
      await sleep(1000);
    }
    loopRunning = false;
  }

  startBreathingBtn.addEventListener('click', () => {
    if (!running) {
      running = true;
      breathingLoop();
    }
  });
  stopBreathingBtn.addEventListener('click', () => {
    running = false;
    breathingText.textContent = 'Stopped. Click Start to Begin';
  });

  // ---------- MEDITATION TIMER (COUNTDOWN) ----------
  const display = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('startTimer');
  const stopBtn = document.getElementById('stopTimer');
  const resetBtn = document.getElementById('resetTimer');

  let totalSeconds = 0;
  let remainingSeconds = 0;
  let timerInterval = null;

  function updateDisplay() {
    const min = Math.floor(remainingSeconds / 60);
    const sec = remainingSeconds % 60;
    display.textContent = `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  }
  updateDisplay();

  startBtn.addEventListener('click', () => {
    if (timerInterval) return; // already running

    // Ask for duration if not set
    if (totalSeconds === 0) {
      let mins = parseInt(prompt("Set meditation duration (minutes):", "10"));
      if (isNaN(mins) || mins <= 0) return;
      totalSeconds = mins * 60;
      remainingSeconds = totalSeconds;
      updateDisplay();
    }

    timerInterval = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        alert("Meditation Complete 🌿");
        startBtn.disabled = false;
      }
    }, 1000);

    startBtn.disabled = true;
  });

  stopBtn.addEventListener('click', () => {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    startBtn.disabled = false;
  });

  resetBtn.addEventListener('click', () => {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    remainingSeconds = totalSeconds;
    updateDisplay();
    startBtn.disabled = false;
  });

  // ---------- AMBIENT SOUNDS ----------
  const sounds = {
    rain: new Audio('sounds/real-rain-sound-379215.mp3'),
    ocean: new Audio('sounds/ocean-waves-112906.mp3'),
    forest: new Audio('sounds/forest-nature-322637.mp3')
  };
  Object.values(sounds).forEach(a => { a.loop = true; a.volume = 0.6; });

  let currentPlaying = null;
  document.querySelectorAll('.soundBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const key = btn.getAttribute('data-sound');
      const audio = sounds[key];
      if (!audio) return;

      // Stop if same button pressed again
      if (currentPlaying === key && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
        btn.classList.remove('playing');
        currentPlaying = null;
        return;
      }

      // Stop previous
      if (currentPlaying && sounds[currentPlaying]) {
        sounds[currentPlaying].pause();
        sounds[currentPlaying].currentTime = 0;
        document.querySelector(`.soundBtn[data-sound="${currentPlaying}"]`)
          ?.classList.remove('playing');
      }

      // Play selected
      try {
        await audio.play();
        currentPlaying = key;
        btn.classList.add('playing');
      } catch (err) {
        alert('Click on the page once, then try again (browser blocks autoplay).');
      }
    });
  });
});
