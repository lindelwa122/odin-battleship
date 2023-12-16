const Ship = (len = 1) => {
  let hits = 0;

  const getLength = () => len;
  const getHits = () => hits;
  const isSunk = () => len === hits;
  const hit = () => !isSunk() && hits++;

  return { getHits, getLength, hit, isSunk }
}

const Gameboard = () => {
  const _board = [];
  const _occupiedSpots = [];
  
  // Initialize board
  for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 10; j++) {
      row[j] = { shipInfo: null, hit: false };
    }
    _board.push(row);
  }

  const receiveAttack = (row, col) => {
    const spot = _board[row][col];
    if (!spot.hit && spot.shipInfo) {
      spot.shipInfo.ship.hit();
      spot.hit = true;

      // Hit other spots that by game logic don't have ships
      const hitSpots = [[row, col]];
      if (row - 1 >= 0 && col - 1 >= 0) {
        _board[row-1][col-1].hit = true;
        hitSpots.push([row-1, col-1]);
      } else if (row - 1 >= 0 && col + 1 <= 9) {
        _board[row-1][col+1].hit = true;
        hitSpots.push([row-1, col+1]);
      } else if (row + 1 <= 0 && col - 1 >= 0) {
        _board[row+1][col-1].hit = true;
        hitSpots.push([row+1, col-1]);
      } else if (row + 1 <= 9 && col + 1 <= 9) {
        _board[row+1][col+1].hit = true;
        hitSpots.push([row+1, col+1]);
      }

      return { hitSpots, shipHit: true };
    } else if (!spot.hit) {
      spot.hit = true;
      return { hitSpots: [[row, col]], shipHit: false };
    } else {
      return { hitSpots: [], shipHit: false };
    }
  }

  const arrayContains = (mainArr, searchArr) => {
    for (const item of mainArr) {
      if (item.length !== searchArr.length) continue;
  
      if (item.toString() === searchArr.toString()) {
        return true;
      }
    }
    return false;
  };

  const _isLegal = (spots) => {
    for (const spot of spots) {
      const [row, col] = spot;

      if (arrayContains(_occupiedSpots, spot)) {
        return false;
      } else if (arrayContains(_occupiedSpots, [row - 1, col])) {
        return false;
      } else if (arrayContains(_occupiedSpots, [row + 1, col])) {
        return false;
      } else if (arrayContains(_occupiedSpots, [row, col - 1])) {
        return false;
      } else if (arrayContains(_occupiedSpots, [row, col + 1])) {
        return false;
      }
    }

    return true;
  }

  const _randCoords = () => ([
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10)
  ]);

  // Random Direction
  const _randDir = () => {
    const ran = Math.floor(Math.random() * 2);
    return ran === 0 ? 'horizontal' : 'vertical';
  }

  const _randomSpots = (len) => {
    if (typeof len !== 'number' || len < 0 || len > 4) {
      throw new Error('The length must be a number and inclusively between 1 and 4');
    }

    while (true) {
      const spots = [];
      const [row, col] = _randCoords();
      const dir = _randDir();
      if (dir === 'horizontal' && col + len <= 10) {
        for (let i = 0; i < len; i++) {
          const curCol = col + i;
          spots.push([row, curCol]);
        }
      } else if (dir === 'vertical' && row + len <= 10) {
        for (let i = 0; i < len; i++) {
          const curRow = row + i;
          spots.push([curRow, col]);
        }
      } else {
        continue;
      }

      if (_isLegal(spots)) {
        spots.forEach(spot => _occupiedSpots.push(spot));
        return { spots, dir };
      }
    }
  }

  const _ships = [];

  const _createShip = (len) => {
    if (typeof len !== 'number' || len < 0 || len > 4) {
      throw new Error('The length must be a number and inclusively between 1 and 4');
    }

    const ship = Ship(len);
    _ships.push(ship);
    const { dir, spots } = _randomSpots(len);
    spots.forEach((spot, index) => {
      const [row, col] = spot;
      _board[row][col].shipInfo = {
        ship,
        direction: dir,
        isStart: index === 0,
        isEnd: index === len - 1
      };
    });
  }

  // Create _ships
  for (let i = 1; i <= 4; i++) {
    for (let j = 0; j < (5 - i); j++) {
      _createShip(i);
    }
  }

  const getBoard = () => _board;

  const isAllSunk = () => _ships.every((ship) => ship.isSunk())

  return { getBoard, isAllSunk, receiveAttack };
}

export { Ship, Gameboard };