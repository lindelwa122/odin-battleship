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
  }

  return { play };
};

export default Game();