import Gameboard from "../gameboard/gameboard";
import Player from "../player/player";
import Computer from "../computer/computer";
import GUI from "../gui/gui";

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

  const _restartGame = () => {
    const playBtn = document.querySelector('.play-again-btn');
    const handleClick = () => {
      playBtn.removeEventListener('click', handleClick);
      document.querySelector('dialog').close();
      const game = Game();
      game.play();
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

  return { play };
};

export default Game();