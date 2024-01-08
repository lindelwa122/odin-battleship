const ship = (len = 1) => {
  let hits = 0;

  const getLength = () => len;
  const getHits = () => hits;
  const isSunk = () => len === hits;
  const hit = () => !isSunk() && hits++;

  return { getHits, getLength, hit, isSunk };
};

export default ship;
