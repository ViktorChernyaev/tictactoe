import { FIELD_SIZE } from "./config";

export const calc0deg = ({ turns, path, row, cell }) => {
  const itemsInRow = [row];
  for (let i = row - 1; i >= 0; i--) { //from clicked to top
    if (turns[`${i}.${cell}`]) itemsInRow.push(i);
    else break;
  }
  for (let i = row + 1; i < FIELD_SIZE; i++) { //from clicked to bottom
    if (turns[`${i}.${cell}`]) itemsInRow.push(i);
    else break;
  }
  return itemsInRow.length;
};
export const calc90deg = ({ turns, path, row, cell }) => {
  const itemsInRow = [cell];
  for (let i = cell - 1; i >= 0; i--) { //from clicked to left
    if (turns[`${row}.${i}`]) itemsInRow.push(i);
    else break;
  }
  for (let i = cell + 1; i < FIELD_SIZE; i++) { //from clicked to right
    if (turns[`${row}.${i}`]) itemsInRow.push(i);
    else break;
  }
  return itemsInRow.length;
};
export const calc135deg = ({ turns, path, row, cell }) => {
  const itemsInRow = [cell];
  return itemsInRow.length;
};
export const calc45deg = ({ turns, path, row, cell }) => {
  const itemsInRow = [cell];
  return itemsInRow.length;
};
