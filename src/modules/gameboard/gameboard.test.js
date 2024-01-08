import gameboard from './gameboard';

test('Test battleship', () => {
  const gb = gameboard();
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
