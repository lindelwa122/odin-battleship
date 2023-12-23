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
    const findShipStart = (row, col, shipInfo) => {
      for (let i = 0; i < 4; i++) {
        let step;
        if (shipInfo.direction === 'horizontal') {
          step = _board[row][col - i].shipInfo;

          if (step.isStart) {
            return col - i
          }
        } else {
          step = _board[row - i][col].shipInfo;

          if (step.isStart) {
            return row - i;
          }
        }
      }
    }

    const hitSpots = [];
    const hitShip = (row, col) => {
      _board[row][col].hit = true;
      hitSpots.push([row, col]);
    }

    const spot = _board[row][col];
    const shipInfo = spot.shipInfo;
    if (!spot.hit && shipInfo) {
      shipInfo.ship.hit();
      hitShip(row, col);

      // Hit other spots that by game logic don't have ships
      row - 1 >= 0 && col - 1 >= 0 && hitShip(row - 1, col - 1);
      row - 1 >= 0 && col + 1 <= 9 && hitShip(row - 1, col + 1);
      row + 1 <= 9 && col - 1 >= 0 && hitShip(row + 1, col - 1);
      row + 1 <= 9 && col + 1 <= 9 && hitShip(row + 1, col + 1);

      if (shipInfo.ship.isSunk()) {
        const shipLen = shipInfo.ship.getLength();
        const start = findShipStart(row, col, shipInfo);
        const dir = shipInfo.direction;

        for (let i = 0; i < shipLen; i++) {
          if (dir === 'horizontal') {
            if (i === 0 && start - 1 >= 0) hitShip(row,  start - 1);

            if (start + i <= 9) {
              row - 1 >= 0 && hitShip(row - 1, start + i);
              row + 1 <= 9 && hitShip(row + 1, start + i);
            }

            if (i === (shipLen - 1) && start + shipLen <= 9) {
              hitShip(row, start + shipLen)
            };
          } else {
            if (i === 0 && start - 1 >= 0) hitShip(start - 1, col);

            if (start + i <= 9) {
              col - 1 >= 0 && hitShip(start + i, col - 1);
              col + 1 <= 9 && hitShip(start + i, col + 1);
            }

            if (i === (shipLen - 1) && start + shipLen <= 9) {
              hitShip(start + shipLen, col);
            };
          }
        }
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
      } else if (arrayContains(_occupiedSpots, [row - 1, col - 1])) {
        return false;
      } else if (arrayContains(_occupiedSpots, [row - 1, col + 1])) {
        return false;
      } else if (arrayContains(_occupiedSpots, [row + 1, col - 1])) {
        return false;
      } else if (arrayContains(_occupiedSpots, [row + 1, col + 1])) {
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

const Player = (gameboard, computer = false) => {
  const _illegalSpots = new Set();

  const _validateCoords = (row, col) => {
    if (!(typeof row === 'number' && typeof col === 'number')) {
      throw new Error('Coordinates should be a number data type.');
    }

    if (isNaN(row) || isNaN(col)) {
      throw new Error('Coordinates should not be NaN.');
    }

    if (row < 0 || row > 9 || col < 0 || col > 9) {
      throw new Error('Invalid coordinates.');
    }

    if (_illegalSpots.has(`${row},${col}`)) {
      return false;
    }

    return true;
  }

  const _getCoords = () => {
    while (true) {
      const random = () => Math.floor(Math.random() * 10);
      const row = random();
      const col = random();

      if (!_illegalSpots.has(`${row},${col}`)) return { row, col };
    }
  }

  const attack = (r, c) => {
    const { row, col } = computer ? _getCoords() : { row: r, col: c };
    if (!_validateCoords(row, col)) return false;

    const { hitSpots, shipHit } = gameboard.receiveAttack(row, col);
    hitSpots.forEach(([row, col]) => _illegalSpots.add(`${row},${col}`));

    return shipHit;
  }

  return { attack };
}

// const GUI = (() => {
//   const paintBoard = (board, computer = false) => {
//     const grid = document.querySelector(computer ? '.comp-grid' : '.my-grid');

//     for (let row = 0; row < board.length; row++) {
//       for (let col = 0; col < board[row].length; col++) {
//         const box = grid.querySelector(`.row[data-coord='${row}'] > .col[data-coord='${col}']`);

//         const spot = board[row][col];
//         const shipInfo = spot.shipInfo;
//         if (shipInfo && shipInfo.ship.isSunk()) {
//           box.classList.add('sunk');
//         } else if (shipInfo && spot.hit) {
//           box.classList.add('ship', 'hit');
//         } else if (shipInfo && !computer) {
//           box.classList.add('ship');
//         } else if (spot.hit) {
//           box.classList.add('hit');
//         }
//       }
//     }
//   }

//   const getPlayerPosition = () => {
//     const spots = document.querySelectorAll('.comp-grid .col');

//     return new Promise((resolve) => {
//       const handleClick = (e) => {
//         spots.forEach((spot) => {
//           spot.removeEventListener('click', handleClick);
//         });

//         const ele = e.target;
//         const parent = ele.parentElement;
//         const row = +parent.dataset.coord;
//         const col = +ele.dataset.coord;
//         resolve({row, col});
//       }

//       spots.forEach((spot) => {
//         spot.addEventListener('click', handleClick);
//       });
//     })
//   }

//   return { getPlayerPosition, paintBoard };
// })();

// const Game = (() => {
//   const _pB = Gameboard(); // playerBoard
//   const _cB = Gameboard() // computerBoard
  
//   const _player = Player(_cB);
//   const _comp = Player(_pB, true);

//   // Paint player's grid
//   GUI.paintBoard(_pB.getBoard());

//   const _isGameOver = () => {
//     return _pB.isAllSunk() || _cB.isAllSunk();
//   }

//   let _currentPlayer = 'player';
//   const play = async () => {
//     while (!_isGameOver()) {
//       if (_currentPlayer === 'player') {
//         const { row, col } = await GUI.getPlayerPosition();
//         const shipHit = _player.attack(row, col);
//         if (!shipHit) _currentPlayer = 'comp';

//         // Update board
//         const b = _cB.getBoard()
//         GUI.paintBoard(b, true);
//       } else {
//         const shipHit = _comp.attack();
//         if (!shipHit) _currentPlayer = 'player';

//         // Update board
//         const b = _pB.getBoard()
//         GUI.paintBoard(b);
//       }
//     }
//   }

//   return { play };
// })();

// (async () => Game.play())();

export { Ship, Gameboard, Player };