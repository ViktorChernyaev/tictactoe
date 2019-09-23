const calcVerticalTop = ({ fields, cell, user }) => {
  for (let i = 0; i <= cell.rowId; i++) {
    const row = fields[cell.rowId - 2 - i];
    if (!row) return i;
    const cellItem = row.cells[cell.cellId - 1];
    if (!cellItem) return i;
    if (cellItem.state !== user) return i;
  }
};
const calcVerticalBottom = ({ fields, cell, user }) => {
  for (let i = 0; i <= cell.rowId; i++) {
    const row = fields[cell.rowId + i];
    if (!row) return i;
    const cellItem = row.cells[cell.cellId - 1];
    if (!cellItem) return i;
    if (cellItem.state !== user) return i;
  }
};

const calcVertical = ({ fields, cell, user }) => {
  const top = calcVerticalTop({ fields, cell, user });
  const bottom = calcVerticalBottom({ fields, cell, user });
  return top + bottom + 1;
};


const calcHorizontalLeft = ({ fields, cell, user }) => {
  const row = fields[cell.rowId - 1];
  for (let i = 0; i <= cell.rowId; i++) {
    const cellItem = row.cells[cell.cellId - 2 - i];
    if (!cellItem) return i;
    if (cellItem.state !== user) return i;
  }
};
const calcHorizontalRight = ({ fields, cell, user }) => {
  const row = fields[cell.rowId - 1];
  for (let i = 0; i <= cell.rowId; i++) {
    const cellItem = row.cells[cell.cellId + i];
    if (!cellItem) return i;
    if (cellItem.state !== user) return i;
  }
};

const calcHorizontal = ({ fields, cell, user }) => {
  const left = calcHorizontalLeft({ fields, cell, user });
  const right = calcHorizontalRight({ fields, cell, user });
  return left + right + 1;
};


const calcTopLeft = ({ fields, cell, user }) => {
  for (let i = 0; i <= cell.rowId; i++) {
    const row = fields[cell.rowId - 2 - i];
    if (!row) return i;
    const cellItem = row.cells[cell.cellId - 2 - i];
    if (!cellItem) return i;
    if (cellItem.state !== user) return i;
  }
};
const calcBottomRight = ({ fields, cell, user }) => {
  for (let i = 0; i <= cell.rowId; i++) {
    const row = fields[cell.rowId + i];
    if (!row) return i;
    const cellItem = row.cells[cell.cellId + i];
    if (!cellItem) return i;
    if (cellItem.state !== user) return i;
  }
};

const calcTopLeftBottomRight = ({ fields, cell, user }) => {
  const topLeft = calcTopLeft({ fields, cell, user });
  const bottomRight = calcBottomRight({ fields, cell, user });
  return topLeft + bottomRight + 1;
};


const calcTopRight = ({ fields, cell, user }) => {
  for (let i = 0; i <= cell.rowId; i++) {
    const row = fields[cell.rowId - 2 - i];
    if (!row) return i;
    const cellItem = row.cells[cell.cellId + i];
    if (!cellItem) return i;
    if (cellItem.state !== user) return i;
  }
};
const calcBottomLeft = ({ fields, cell, user }) => {
  for (let i = 0; i <= cell.rowId; i++) {
    const row = fields[cell.rowId + i];
    if (!row) return i;
    const cellItem = row.cells[cell.cellId - 2 - i];
    if (!cellItem) return i;
    if (cellItem.state !== user) return i;
  }
};

const calcTopRightBottomLeft = ({ fields, cell, user }) => {
  const topRight = calcTopRight({ fields, cell, user });
  const bottomLeft = calcBottomLeft({ fields, cell, user });
  return topRight + bottomLeft + 1;
};

export const computeScore = ({ fields, cell, user, sizeToWin }) => {
  const vertical = calcVertical({ fields, cell, user }) >= sizeToWin;
  const horizontal = calcHorizontal({ fields, cell, user }) >= sizeToWin;
  const topLeftBottomRight = calcTopLeftBottomRight({ fields, cell, user }) >= sizeToWin;
  const topRightBottomLeft = calcTopRightBottomLeft({ fields, cell, user }) >= sizeToWin;
  const isWinner = vertical || horizontal || topLeftBottomRight || topRightBottomLeft;
  return isWinner ? user : null;
};
