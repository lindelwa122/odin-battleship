const Playerlayer = (gameboard) => {
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
  };

  const attack = (row, col) => {
    if (!_validateCoords(row, col)) return null;

    const { hitSpots, shipHit } = gameboard.receiveAttack(row, col);
    hitSpots.forEach(([row, col]) => _illegalSpots.add(`${row},${col}`));

    return { shipHit, hitSpots };
  };

  return { attack };
};

export default Playerlayer;
