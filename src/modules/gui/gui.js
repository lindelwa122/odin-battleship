const GUI = () => {
  const paintBoard = (board, computer = false) => {
    const grid = document.querySelector(computer ? '.comp-grid' : '.my-grid');

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const box = grid.querySelector(`.row[data-coord='${row}'] > .col[data-coord='${col}']`);

        const spot = board[row][col];
        const shipInfo = spot.shipInfo;
        if (shipInfo && shipInfo.ship.isSunk()) {
          box.classList.add('sunk');
        } else if (shipInfo && spot.hit) {
          box.classList.add('ship', 'hit');
        } else if (shipInfo && !computer) {
          box.classList.add('ship');
        } else if (spot.hit) {
          box.classList.add('hit');
        }
      }
    }
  }

  const getPlayerPosition = () => {
    const spots = document.querySelectorAll('.comp-grid .col');

    return new Promise((resolve) => {
      const handleClick = (e) => {
        spots.forEach((spot) => {
          spot.removeEventListener('click', handleClick);
        });

        const ele = e.target;
        const parent = ele.parentElement;
        const row = +parent.dataset.coord;
        const col = +ele.dataset.coord;
        resolve({row, col});
      }

      spots.forEach((spot) => {
        spot.addEventListener('click', handleClick);
      });
    })
  }

  const showForm = () => {
    document.querySelector('form').style.display = 'flex';
  }

  const hideForm = () => {
    document.querySelector('form').style.display = 'none';
  }

  return { getPlayerPosition, paintBoard, showForm, hideForm };
};

export default GUI();
