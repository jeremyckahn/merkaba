export const absolutizeCoordinates = (x1, y1, x2, y2) => ({
  x: x1 + Math.min(x2, 0),
  y: y1 + Math.min(y2, 0),
  width: Math.abs(x2),
  height: Math.abs(y2),
});
