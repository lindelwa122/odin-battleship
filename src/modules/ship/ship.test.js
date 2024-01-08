import Ship from './ship';

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
