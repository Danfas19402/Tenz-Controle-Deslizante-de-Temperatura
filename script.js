const kelvinSlider = document.getElementById('kelvin');
const currentLabel = document.getElementById('current');
const warmOverlay = document.querySelector('.warm-overlay');
const coldOverlay = document.querySelector('.cold-overlay');
const lightIndicator = document.getElementById('light-indicator');
const clickSound = document.getElementById('click-sound');

const baseValue = 4900;
const savedValue = parseInt(localStorage.getItem('kelvin')) || baseValue;

kelvinSlider.value = savedValue;
updateTemperature(savedValue);

kelvinSlider.addEventListener('input', (e) => {
  const value = parseInt(e.target.value);
  updateTemperature(value);
  localStorage.setItem('kelvin', value);
  playClickSound();
});

function mapValue(value, inMin, inMax, outMin = 0, outMax = 1) {
  const proportion = (value - inMin) / (inMax - inMin);
  return outMin + (proportion * (outMax - outMin));
}

function updateTemperature(v) {
  currentLabel.textContent = `${v}K`;

  const coldOpacity = mapValue(v, baseValue, 6500, 0, 0.8);
  const warmOpacity = mapValue(v, baseValue, 2700, 0, 0.8);

  if (v > baseValue) {
    warmOverlay.style.opacity = 0;
    coldOverlay.style.opacity = coldOpacity;
  } else {
    coldOverlay.style.opacity = 0;
    warmOverlay.style.opacity = warmOpacity;
  }

  const tempRatio = mapValue(v, 2700, 6500, 0, 1);
  const warmColor = [255, 180, 80];
  const coldColor = [150, 200, 255];

  const r = Math.round(warmColor[0] + (coldColor[0] - warmColor[0]) * tempRatio);
  const g = Math.round(warmColor[1] + (coldColor[1] - warmColor[1]) * tempRatio);
  const b = Math.round(warmColor[2] + (coldColor[2] - warmColor[2]) * tempRatio);

  const color = `rgb(${r}, ${g}, ${b})`;
  lightIndicator.style.background = `radial-gradient(circle, #fff 0%, ${color} 40%, ${color} 100%)`;
  lightIndicator.style.boxShadow = `0 0 60px ${color}`;
}

// Som de clique suave
function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.volume = 0.15; // Volume suave
  clickSound.play();
}
