window.saveDataAcrossSessions = false;

let LOCK_TIME = 200; // milliseconds
const UP_CUTOFF = window.innerHeight / 4;
const DOWN_CUTOFF = window.innerHeight - window.innerHeight / 4;
const MAX_SPEED = 150;
const MIN_SPEED = 12;
const MIN_LOCK_TIME = 20;
const MAX_LOCK_TIME = 150;
let calibration_mode = true;
let lookDirection = null;
let currentlyScrolling = false;

function scrollByAmount(amount, behavior = "smooth") {
  if (currentlyScrolling || calibration_mode) return;

  currentlyScrolling = true;

  window.scrollBy({
    top: amount,
    behavior: behavior,
  });

  setTimeout(() => {
    currentlyScrolling = false;
  }, LOCK_TIME);
}

setTimeout(() => {
  calibration_mode = false;
  window.alert("Calibration complete! Scroll with your eyes now.");
}, 20000);

webgazer.setGazeListener((data, timestamp) => {
  if (!data) return;

  if (data.y < UP_CUTOFF) {
    let percentage = 1 - data.y / UP_CUTOFF;
    let scroll_amount = (MAX_SPEED - MIN_SPEED) * percentage + MIN_SPEED;
    LOCK_TIME = (MAX_LOCK_TIME - MIN_LOCK_TIME) * percentage + MIN_LOCK_TIME;
    scrollByAmount(-1 * scroll_amount);
  } else if (data.y > DOWN_CUTOFF) {
    let percentage = (data.y - DOWN_CUTOFF) / (window.innerHeight - DOWN_CUTOFF);
    let scroll_amount = (MAX_SPEED - MIN_SPEED) * percentage + MIN_SPEED;
    LOCK_TIME = (MAX_LOCK_TIME - MIN_LOCK_TIME) * percentage + MIN_LOCK_TIME;
    scrollByAmount(scroll_amount);
  }
}).begin();
webgazer.showVideoPreview(true).showPredictionPoints(true);
