export const USERS = ['green', 'red'];
export const FIELD_SIZE = 10;
export const SIZES_TO_WIN = [3, 4, 5];

const arr = Array.from(Array(FIELD_SIZE).keys());
export const FIELD_BODY = arr.map((item, row) => {
  return arr.map((item, cell) => ({ row, cell, path: `${row}.${cell}` }));
});
