import computer from './computer';
import gameboard from '../gameboard/gameboard';

test('test player (computer)', () => {
  const gb = gameboard();
  const comp = computer(gb, true);

  comp.prepareAttack();

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
