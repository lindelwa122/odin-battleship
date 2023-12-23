import { Ship, Gameboard, Player } from './index';

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
  expect(target2.hit).toBe(true);

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      gb.receiveAttack(row, col);
    }
  }

  expect(gb.isAllSunk()).toBe(true);
});

test('test player', () => {
  const gb = Gameboard();
  const player = Player(gb);

  player.attack(4, 5);

  const board = gb.getBoard();
  expect(board[4][5].hit).toBe(true);

  player.attack(1, 5);
  player.attack(0, 0);
  player.attack(9, 3);
  player.attack(7, 1);

  const newBoard = gb.getBoard();
  expect(newBoard[1][5].hit).toBe(true);
  expect(newBoard[0][0].hit).toBe(true);
  expect(newBoard[9][3].hit).toBe(true);
  expect(newBoard[7][1].hit).toBe(true);

  expect(() => player.attack('str', 7)).toThrow('Coordinates should be a number data type.');
  expect(() => player.attack(2, 'not a num')).toThrow('Coordinates should be a number data type.');
  expect(() => player.attack('str', 'a')).toThrow('Coordinates should be a number data type.');
  expect(player.attack(0, 0)).toBe(false);
  expect(() => player.attack(-1, 10)).toThrow('Invalid coordinates.');
});

test('test player (computer)', () => {
  const gb = Gameboard();
  const player = Player(gb, true);

  player.attack();

  // Test if at least one spot was attacked
  const board = gb.getBoard();
  let attackedSpots = 0;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col].hit) attackedSpots++;
    }
  }

  expect(attackedSpots).toBeGreaterThanOrEqual(1);
});
