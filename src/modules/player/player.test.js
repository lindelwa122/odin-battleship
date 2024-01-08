import Player from './player';
import Gameboard from '../gameboard/gameboard';

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

  expect(() => player.attack('str', 7)).toThrow(
    'Coordinates should be a number data type.',
  );
  expect(() => player.attack(2, 'not a num')).toThrow(
    'Coordinates should be a number data type.',
  );
  expect(() => player.attack('str', 'a')).toThrow(
    'Coordinates should be a number data type.',
  );
  expect(player.attack(0, 0)).toBe(null);
  expect(() => player.attack(-1, 10)).toThrow('Invalid coordinates.');
});
