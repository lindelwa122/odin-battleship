import Gameboard from "../gameboard/gameboard";
import Player from "../player/player";
import Computer from "../computer/computer";
import GUI from "../gui/gui";
import startGame from "../../startGame";

const Game = () => {
  const _pB = Gameboard(); // playerBoard
  const _cB = Gameboard() // computerBoard
  
  const _player = Player(_cB);
  const _comp = Computer(_pB, true);

  // Paint player's grid
  GUI.paintBoard(_pB.getBoard());

  const _isGameOver = () => {
    return _pB.isAllSunk() || _cB.isAllSunk();
  }

  const _cleanUpBoard = () => {
    const spots = document.querySelectorAll('.col');
    spots.forEach(spot => spot.classList.remove('sunk', 'ship', 'hit'));
  }

  const _restartGame = () => {
    const playBtn = document.querySelector('.play-again-btn');
    const handleClick = () => {
      playBtn.removeEventListener('click', handleClick);
      document.querySelector('dialog').close();
      _cleanUpBoard();
      GUI.showForm();
      startGame();
    }

    playBtn.addEventListener('click', handleClick);
  }

  const _displayWinner = () => {
    const playerWon = _cB.isAllSunk();
    const dialog = document.querySelector('dialog');
    dialog.showModal();
    const textContainer = dialog.querySelector('p');
    textContainer.textContent = playerWon
      ? 'Game Over. Congratulations!! You won.'
      : 'Game Over. You lost.';

    _restartGame();
  }

  let _currentPlayer = 'player';
  const play = async () => {
    while (!_isGameOver()) {
      if (_currentPlayer === 'player') {
        const { row, col } = await GUI.getPlayerPosition();
        const res = _player.attack(row, col);

        if (res && !res.shipHit) _currentPlayer = 'comp';

        // Update board
        const b = _cB.getBoard()
        GUI.paintBoard(b, true);
      } else {
        _comp.prepareAttack();
        _currentPlayer = 'player';

        // Update board
        const b = _pB.getBoard()
        GUI.paintBoard(b);
      }
    }

    _displayWinner();
  }

  const _findShipStart = (row, col, shipInfo) => {
    const board = _pB.getBoard();
    for (let i = 0; i < 4; i++) {
      let step;
      if (shipInfo.direction === "horizontal") {
        step = board[row][col - i].shipInfo;

        if (step.isStart) {
          return { row, col: col - i};
        }
      } else {
        step = board[row - i][col].shipInfo;

        if (step.isStart) {
          return { row: row - i, col };
        }
      }
    }
  };

  const _getShipInfo = (row, col) => {
    const shipCoords = [];
    const board = _pB.getBoard();
    const shipInfo = board[row][col].shipInfo;
    const shipLen = shipInfo.ship.getLength();
    const shipStart = _findShipStart(row, col, shipInfo);

    console.log('row start', shipStart.row)
    console.log('col start', shipStart.col)

    for (let i = 0; i < shipLen; i++) {
      if (shipInfo.direction === 'horizontal') {
        shipCoords.push({ row, col: shipStart.col + i });
      } else {
        shipCoords.push({ row: shipStart.row + i, col });
      }
    }

    return { dir: shipInfo.direction, shipCoords };
  }

  const _validateNewCoords = (row, col, shipLen, dir) => {
    const isOccupied = (row, col) => {
      const board = _pB.getBoard();
      if (row >= 0 && row <= 9 && col >= 0 && col <= 9) {
        return Boolean(board[row][col].shipInfo);
      } else {
        return false;
      }
    }

    const isLegal = (spots) => {
      for (const spot of spots) {
        const { row, col } = spot;
  
        if (isOccupied(row, col)) return false;
        else if (isOccupied(row - 1, col)) return false;
        else if (isOccupied(row + 1, col)) return false;
        else if (isOccupied(row, col - 1)) return false;
        else if (isOccupied(row, col + 1)) return false;
        else if (isOccupied(row - 1, col - 1))  return false;
        else if (isOccupied(row - 1, col + 1)) return false;
        else if (isOccupied(row + 1, col - 1)) return false;
        else if (isOccupied(row + 1, col + 1)) return false;
      }
  
      return true;
    };

    const  newCoords = []
    for (let i = 0; i < shipLen; i++) {
      if (dir === 'horizontal') {
        newCoords.push({ row, col: col + i });
      } else {
        newCoords.push({ row: row + i, col });
      }
    }

    console.log(newCoords);

    return isLegal(newCoords);
  }

  const updateShipCoords = (row, col, newRow, newCol) => {
    console.log("identify row", row)

    const board = _pB.getBoard();
    if (!board[row][col].shipInfo) return false;

    const { shipCoords, dir } = _getShipInfo(row, col);

    if (!_validateNewCoords(newRow, newCol, shipCoords.length, dir)) {
      return false;
    }

    for (let i = 0; i < shipCoords.length; i++) {
      console.log('i', i);
      console.log('newRow', newRow);
      console.log('newCol', newCol);
      const { row, col } = shipCoords[i];
      console.log('row', row);
      console.log('col', col);
      if (dir === 'horizontal') {
        board[newRow][newCol + i] = board[row][col];
      } else {
        board[newRow + i][newCol] = board[row][col];
      }
      board[row][col] = { shipInfo: null, hit: false };
    }

    _cleanUpBoard();
    GUI.paintBoard(_pB.getBoard());

    return true;
  }

  return { play, updateShipCoords };
};

export default Game;