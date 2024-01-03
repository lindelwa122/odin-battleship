import "normalize.css";
import "./style.css";
import Game from "./modules/game/game";

const updateCoordsBtn = document.querySelector('.update-coords-btn');
updateCoordsBtn.addEventListener('click', () => {
  const oldRow = document.querySelector('.from > .row').value;
  const oldCol = document.querySelector('.from > .col').value;
  const newRow = document.querySelector('.to > .row').value;
  const newCol = document.querySelector('.to > .col').value;

  const updated = Game.updateShipCoords(+oldRow, +oldCol, +newRow, +newCol);
  if (!updated) {
    alert("Board wasn't updated, check if your coordinates are correct.");
  }
});

const playBtn = document.querySelector('.play-btn');
playBtn.addEventListener('click', () => {
  Game.play();
});
