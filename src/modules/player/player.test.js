import player from './player';
import gameboard from '../gameboard/gameboard';

test('test player', () => {
  const gb = gameboard();
  const p = player(gb);

  p.attack(4, 5);

  const board = gb.getBoard();
  expect(board[4][5].hit).toBe(true);

  p.attack(1, 5);
  p.attack(0, 0);
  p.attack(9, 3);
  p.attack(7, 1);

  const newBoard = gb.getBoard();
  expect(newBoard[1][5].hit).toBe(true);
  expect(newBoard[0][0].hit).toBe(true);
  expect(newBoard[9][3].hit).toBe(true);
  expect(newBoard[7][1].hit).toBe(true);

  expect(() => p.attack('str', 7)).toThrow(
    'Coordinates should be a number data type.',
  );
  expect(() => p.attack(2, 'not a num')).toThrow(
    'Coordinates should be a number data type.',
  );
  expect(() => p.attack('str', 'a')).toThrow(
    'Coordinates should be a number data type.',
  );
  expect(p.attack(0, 0)).toBe(null);
  expect(() => p.attack(-1, 10)).toThrow('Invalid coordinates.');
});
