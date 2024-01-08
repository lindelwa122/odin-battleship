import ship from './ship';

test('Test s 1', () => {
  const s = ship(4);

  expect(s.getLength()).toBe(4);
  expect(s.getHits()).toBe(0);

  s.hit();
  expect(s.getLength()).toBe(4);
  expect(s.getHits()).toBe(1);
  expect(s.isSunk()).toBe(false);

  s.hit();
  s.hit();
  s.hit();
  expect(s.getHits()).toBe(4);
  expect(s.isSunk()).toBe(true);

  s.hit();
  expect(s.getHits()).toBe(4);
});

test('Test s 2', () => {
  const s = ship(3);

  expect(s.getLength()).toBe(3);
  expect(s.getHits()).toBe(0);

  s.hit();
  expect(s.getLength()).toBe(3);
  expect(s.getHits()).toBe(1);
  expect(s.isSunk()).toBe(false);

  s.hit();
  s.hit();
  expect(s.getHits()).toBe(3);
  expect(s.isSunk()).toBe(true);

  s.hit();
  expect(s.getHits()).toBe(3);
});
