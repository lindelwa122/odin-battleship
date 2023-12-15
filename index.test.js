import { Ship, Gameboard } from './index';

test('Test ship 1', () => {
  const ship = Ship(4);

  expect(ship.getLength()).toBe(4);
  expect(ship.getHits()).toBe(0);
  
  ship.hit();
  expect(ship.getLength()).toBe(4);
  expect(ship.getHits()).toBe(1);
  expect(ship.isSunk()).toBe(false);

  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.getHits()).toBe(4);
  expect(ship.isSunk()).toBe(true);
  
  ship.hit();
  expect(ship.getHits()).toBe(4);
});

test('Test ship 2', () => {
  const ship = Ship(3);

  expect(ship.getLength()).toBe(3);
  expect(ship.getHits()).toBe(0);
  
  ship.hit();
  expect(ship.getLength()).toBe(3);
  expect(ship.getHits()).toBe(1);
  expect(ship.isSunk()).toBe(false);

  ship.hit();
  ship.hit();
  expect(ship.getHits()).toBe(3);
  expect(ship.isSunk()).toBe(true);
  
  ship.hit();
  expect(ship.getHits()).toBe(3);
});

test('Test battleship', () => {
  const gb = Gameboard();
  const board = gb.getBoard();

  const countedShips = [];
  const shipCount = { 1: 0, 2: 0, 3: 0, 4: 0 };

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const spot = board[row][col];
      const shipInfo = spot.shipInfo;

      if (shipInfo && !countedShips.includes(`${row},${col}`)) {
        const size = shipInfo.ship.getLength();
        shipCount[size]++;

        if (shipInfo.direction === 'horizontal') {
          for (let i = 0; i < size; i++) {
            countedShips.push(`${row},${col + i}`);
          }
        } else {
          for (let i = 0; i < size; i++) {
            countedShips.push(`${row + i},${col}`);
          }
        }
      }
    }
  }

  expect(gb.isAllSunk()).toBe(false);
  expect(shipCount[1]).toBe(4);
  expect(shipCount[2]).toBe(3);
  expect(shipCount[3]).toBe(2);
  expect(shipCount[4]).toBe(1);

  const row = countedShips[0].split(',')[0];
  const col = countedShips[0].split(',')[1];
  const target = board[row][col].shipInfo.ship;
  target.hit();
  expect(target.getHits()).toBe(1);

  const ran = () => Math.floor(Math.random() * 10);
  const x = ran();
  const y = ran();

  gb.receiveAttack(x, y);
  const target2 = board[x][y];
  expect(target2.hit()).toBe(true);

  for (let row = 0; row < board; row++) {
    for (let col = 0; col < board[row]; row++) {
      gb.receiveAttack(row, col);
    }
  }

  expect(gb.isAllSunk()).toBe(true);
});