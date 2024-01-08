import Player from '../player/player';

const Computer = (gameboard) => {
  const p = Player(gameboard, true);
  const _targets = [];
  const _illegalSpots = new Set();

  const _getPotentialTarget = () => {
    const pickOne = (arr) => {
      const random = Math.floor(Math.random() * arr.length);
      return arr[random];
    };

    const board = gameboard.getBoard();
    const targets = [];

    for (const { row, col } of _targets) {
      if (row - 1 >= 0 && !board[row - 1][col].hit) {
        targets.push({ row: row - 1, col });
      }

      if (col + 1 <= 9 && !board[row][col + 1].hit) {
        targets.push({ row, col: col + 1 });
      }

      if (row + 1 <= 9 && !board[row + 1][col].hit) {
        targets.push({ row: row + 1, col });
      }

      if (col - 1 >= 0 && !board[row][col - 1].hit) {
        targets.push({ row, col: col - 1 });
      }

      if (targets.length > 0) return pickOne(targets);
    }
  };

  const _getCoords = () => {
    if (_targets.length > 0) {
      return _getPotentialTarget();
    } else {
      while (true) {
        const random = () => Math.floor(Math.random() * 10);
        const row = random();
        const col = random();

        if (!_illegalSpots.has(`${row},${col}`)) return { row, col };
      }
    }
  };

  const _hasShipSank = (row, col) => {
    const board = gameboard.getBoard();
    const shipInfo = board[row][col].shipInfo;
    return shipInfo && shipInfo.ship.isSunk();
  };

  const _updateIllegalSpots = (spots) => {
    spots.forEach(([row, col]) => _illegalSpots.add(`${row},${col}`));
  };

  const _clearTargets = () => {
    const len = _targets.length;
    _targets.splice(0, len);
  };

  const _attack = (row, col) => {
    let { shipHit, hitSpots } = p.attack(row, col);
    _updateIllegalSpots(hitSpots);

    const shipSank = shipHit ? _hasShipSank(row, col) : false;
    if (shipHit && shipSank) {
      _clearTargets();
      prepareAttack();
    } else if (shipHit && !shipSank) {
      _targets.push({ row, col });
      prepareAttack();
    }
  };

  const prepareAttack = () => {
    const { row, col } = _getCoords();
    _attack(row, col);
  };

  return { prepareAttack };
};

export default Computer;
