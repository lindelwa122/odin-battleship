import gameFunc from './modules/game/game';
import GUI from './modules/gui/gui';

const startGame = () => {
  const game = gameFunc();

  const getFormData = (form) => {
    const formData = {};
    for (const data of form) {
      formData[data.name] = data.value;
    }
    return formData;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const { oldRow, oldCol, newRow, newCol } = getFormData(e.target);
    const updated = game.updateShipCoords(+oldRow, +oldCol, +newRow, +newCol);
    if (!updated) {
      alert("Board wasn't updated, check if your coordinates are correct.");
    }
  };

  const form = document.querySelector('form');
  form.addEventListener('submit', submitHandler);

  const playHandler = () => {
    form.removeEventListener('submit', submitHandler);
    playBtn.removeEventListener('click', playHandler);
    GUI.hideForm();
    game.play();
  };

  const playBtn = document.querySelector('.play-btn');
  playBtn.addEventListener('click', playHandler);
};

export default startGame;
