import Computer from "./computer";
import Gameboard from "../gameboard/gameboard";

test('test player (computer)', () => {
  const gb = Gameboard();
  const comp = Computer(gb, true);

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