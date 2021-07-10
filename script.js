window.saveDataAcrossSessions = true;

const LEFT_CUTOFF = window.innerWidth / 4;
const RIGHT_CUTOFF = window.innerWidth - window.innerWidth / 4;
const LOOK_Delay = 1500;

let startLookingTime = Number.POSITIVE_INFINITY;
let lookDirection = null;
let imageElement = getNewImage();
let nextImageElement = getNewImage(true);

webgazer.setGazeListener((data, timestamp) => {
  if (data == null || lookDirection === 'STOP') return;
  if (data.x < LEFT_CUTOFF && lookDirection !== 'LEFT' && lookDirection !== 'RESET') {
    startLookingTime = timestamp;
    lookDirection = 'LEFT'
  } else if (data.x > RIGHT_CUTOFF && lookDirection !== 'RIGHT' && lookDirection !== 'RESET') {
    startLookingTime = timestamp;
    lookDirection = 'RIGHT';
  } else if (data.x >= LEFT_CUTOFF && data.x <= RIGHT_CUTOFF) {
    startLookingTime = Number.POSITIVE_INFINITY;
    lookDirection = null;
  }

  if (startLookingTime + LOOK_Delay < timestamp) {
    if (lookDirection === 'LEFT') {
      imageElement.classList.add('left');
    } else {
      imageElement.classList.add('right');
    }
    startLookingTime = Number.POSITIVE_INFINITY;
    lookDirection = 'STOP';
    setTimeout(() => {
      imageElement.remove();
      nextImageElement.classList.remove('next');
      imageElement = nextImageElement;
      nextImageElement = getNewImage(true);
      lookDirection = 'RESET';
    }, 200)
  };
}).begin();

webgazer.showVideoPreview(false).showPredictionPoints(false);

function getNewImage(next = false) {
  const img = document.createElement('img');
  img.src = "https://picsum.photos/1000?" + Math.random();
  if (next) img.classList.add("next");
  document.body.append(img);
  return img;
}