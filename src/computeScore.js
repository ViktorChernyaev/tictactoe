import { FIELD_SIZE } from "./config";

export const calc0deg = ({ turns, path, row, cell }) => {
  const itemsInRow = [path];
  for (let i = row - 1; i >= 0; i--) {
    const nextPath = `${i}.${cell}`; //from clicked to top
    if (turns[nextPath]) itemsInRow.push(nextPath);
    else break;
  }
  for (let i = row + 1; i < FIELD_SIZE; i++) {
    const nextPath = `${i}.${cell}`; //from clicked to bottom
    if (turns[nextPath]) itemsInRow.push(nextPath);
    else break;
  }
  return itemsInRow.length;
};
export const calc90deg = ({ turns, path, row, cell }) => {
  const itemsInRow = [path];
  for (let i = cell - 1; i >= 0; i--) {
    const nextPath = `${row}.${i}`; //from clicked to left
    if (turns[nextPath]) itemsInRow.push(nextPath);
    else break;
  }
  for (let i = cell + 1; i < FIELD_SIZE; i++) {
    const nextPath = `${row}.${i}`; //from clicked to right
    if (turns[nextPath]) itemsInRow.push(nextPath);
    else break;
  }
  return itemsInRow.length;
};
export const calc135deg = ({ turns, path, row, cell }) => {
  const itemsInRow = [path];
  for (let i = cell - 1; i >= 0; i--) {
    const nextPath = `${i + row - cell}.${i}`; //from clicked to top-left
    if (turns[nextPath]) itemsInRow.push(nextPath);
    else break;
  }
  for (let i = cell + 1; i < FIELD_SIZE; i++) {
    const nextPath = `${i + row - cell}.${i}`; //from clicked to bottom-right
    if (turns[nextPath]) itemsInRow.push(nextPath);
    else break;
  }
  return itemsInRow.length;
};
export const calc45deg = ({ turns, path, row, cell }) => {
  const itemsInRow = [path];
  for (let i = cell - 1; i >= 0; i--) {
    const nextPath = `${row + cell - i}.${i}`; //from clicked to top-right
    if (turns[nextPath]) itemsInRow.push(nextPath);
    else break;
  }
  for (let i = cell + 1; i < FIELD_SIZE; i++) {
    const nextPath = `${row + cell - i}.${i}`; //from clicked to bottom-left
    if (turns[nextPath]) itemsInRow.push(nextPath);
    else break;
  }
  return itemsInRow.length;
};
