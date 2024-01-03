import "normalize.css";
import "./style.css";
import Game from "./modules/game/game";
import GUI from "./modules/gui/gui";

const getFormData = (form) => {
  const formData = {};
  for (const data of form) {
    formData[data.name] = data.value;
  }
  return formData;
}

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const { oldRow, oldCol, newRow, newCol } = getFormData(e.target);
  const updated = Game.updateShipCoords(+oldRow, +oldCol, +newRow, +newCol);
  if (!updated) {
    alert("Board wasn't updated, check if your coordinates are correct.");
  }
});

const playBtn = document.querySelector('.play-btn');
playBtn.addEventListener('click', () => {
  GUI.hideForm();
  Game.play();
});
