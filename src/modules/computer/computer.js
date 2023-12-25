import Player from "../player/player";

const Computer = (gameboard) => {
  const p = Player(gameboard, true);
  let _target = null;
  const _illegalSpots = new Set();

  const _getPotentialTarget = (row, col) => {
    const pickOne = (arr) => {
      const random = Math.floor(Math.random() * arr.length);
      return arr[random];
    }

    const board = gameboard.getBoard();
    const targets = [];

    console.log('row', row);
    console.log('col', col);

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

    return pickOne(targets);
  }

  const _getCoords = () => {
    if (_target) {
      console.log('target', _target);
      return _getPotentialTarget(_target.row, _target.col);
    } else {
      while (true) {
        const random = () => Math.floor(Math.random() * 10);
        const row = random();
        const col = random();

        if (!_illegalSpots.has(`${row},${col}`)) return { row, col };
      }
    }
  }

  const _hasShipSank  = (row, col) => {
    const board = gameboard.getBoard();
    const shipInfo = board[row][col].shipInfo;
    return shipInfo && shipInfo.ship.isSunk();
  }

  const _updateIllegalSpots = (spots) => {
    spots.forEach(([row, col]) => _illegalSpots.add(`${row},${col}`));
  }

  const _getSurroundings = (row, col) => {
    const surroundings = [];

    if (row - 1 >= 0) surroundings.push({ row: row - 1, col });
    if (col + 1 <= 9) surroundings.push({ row, col: col + 1 });
    if (row + 1 <= 9) surroundings.push({ row: row + 1, col });
    if (col - 1 >= 0) surroundings.push({ row, col: col - 1 });

    return surroundings;
  }

  const _getSpotWithShip = (surroundings) => {
    const board = gameboard.getBoard();
    for (const { row, col } of surroundings) {
      if (board[row][col].shipInfo) {
        return { row, col };
      }
    }
  }
  
  const _getNewTarget = (row, col) => {
    const surroundings = _getSurroundings(row, col);
    const target = _getSpotWithShip(surroundings);
    if (_getPotentialTarget(target.row, _target.col)) {
      return target;
    } else {
      return _getNewTarget(target.row, target.col);
    }
  } 

  const _attack = (row, col) => {
    let { shipHit, hitSpots } = p.attack(row, col);
    _updateIllegalSpots(hitSpots);

    const shipSank = _hasShipSank(row, col);
    if (shipHit && !shipSank) {
      if (!_target || !_getPotentialTarget(_target.row, _target.col)) {
        _target = { row, col };
      }
      prepareAttack();
    } else if (shipHit && shipSank) {
      _target = null;
      prepareAttack();
    } else if (_target && !_getPotentialTarget(_target.row, _target.col)) {
      _target = _getNewTarget(_target.row, _target.col);
    }
  }

  const prepareAttack = () => {
    const { row, col } = _getCoords();
    _attack(row, col);
  }

  return { prepareAttack };
}

export default Computer;
