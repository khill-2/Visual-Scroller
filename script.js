window.saveDataAcrossSessions = false;

let LOCK_TIME = 200; // 1 second
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
  
  if (currentlyScrolling || calibration_mode) {
    return;
  }

  currentlyScrolling = true;

  // Scroll the window by the specified amount
  window.scrollBy({
    top: amount,
    behavior: behavior,
  });

  // After scrolling is complete, set currentlyScrolling to false
  setTimeout(() => {
    currentlyScrolling = false;
  }, LOCK_TIME); // Adjust the time as needed to match your scroll duration
}

setTimeout(() => {
  calibration_mode = false;
  window.alert("Calibration is over. You can now scroll with your eyes.");
}, 20000);

  webgazer
  .setGazeListener((data, timestamp) => {
    if (data == null) return;

    if (data.y < UP_CUTOFF) {
      let percentage = 1 - data.y / UP_CUTOFF;
      let scroll_amount = (MAX_SPEED - MIN_SPEED) * percentage + MIN_SPEED;
      LOCK_TIME = (MAX_LOCK_TIME - MIN_LOCK_TIME) * percentage + MIN_LOCK_TIME;
      scrollByAmount(-1 * scroll_amount, "smooth");
    } else if (data.y > DOWN_CUTOFF) {
      let percentage = (data.y - DOWN_CUTOFF) / (window.innerHeight - DOWN_CUTOFF);
      let scroll_amount = (MAX_SPEED - MIN_SPEED) * percentage + MIN_SPEED;
      LOCK_TIME = (MAX_LOCK_TIME - MIN_LOCK_TIME) * percentage + MIN_LOCK_TIME;
      scrollByAmount(scroll_amount, "smooth");
    }
  }).begin();

webgazer.showVideoPreview(true).showPredictionPoints(true); // Display video preview
