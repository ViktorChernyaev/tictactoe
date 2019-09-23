import React from "react";
import { createEvent, createEffect, createStore, combine } from "effector";
import { useStore } from "effector-react";
import { Row, Square } from "./ui";

const USERS = ["Bruce Wayne", "Tony Stark"]; //unique names
const INITIAL_USER = USERS[0];
const FIELD_SIZE = 10;
const SIZES_TO_WIN = [3, 4, 5];
const DEF_SIZE_TO_WIN = SIZES_TO_WIN[0]
const FIELDS = Array.from(Array(FIELD_SIZE).keys()).map(row => {
  const rowId = row + 1;
  return {
    id: rowId,
    cells: Array.from(Array(FIELD_SIZE).keys()).map(cell => {
      return { rowId, cellId: cell + 1, state: null };
    })
  };
});

const computeWinner = ({ fields, cell, user, sizeToWin }) => {
  const vertical = fields.reduce((acc, row) => {
    const haveScoreInRow = row.cells.find(item => item.cellId === cell.cellId && item.state === user);
    return haveScoreInRow ? acc + 1 : acc;
  }, 1) >= sizeToWin;
  const horizontal = fields
    .find(row => row.id ===cell.rowId).cells
    .reduce((acc, row) => {
      return row.state === user ? acc + 1 : acc;
    }, 1) >= sizeToWin;
  const topLeft = fields.reduce((acc, row, rowI) => {
    const rowId = rowI + 1;
    if (rowId < cell.rowId) { //top
      const targetCell = row.cells[(cell.cellId - (cell.rowId - rowId)) - 1];
      return (targetCell && targetCell.state === user) ? acc + 1 : acc;
    } else if (rowId > cell.rowId) { //bottom
      const targetCell = row.cells[(cell.cellId + (rowId - cell.rowId)) - 1];
      return (targetCell && targetCell.state === user) ? acc + 1 : acc;
    }
    return acc;
  }, 1) >= sizeToWin;
  const topRight = fields.reduce((acc, row, rowI) => {
    const rowId = rowI + 1;
    if (rowId < cell.rowId) { //top
      const targetCell = row.cells[(cell.cellId + (cell.rowId - rowId )) - 1];
      return (targetCell && targetCell.state === user) ? acc + 1 : acc;
    } else if (rowId > cell.rowId) { //bottom
      const targetCell = row.cells[(cell.cellId - (rowId - cell.rowId)) - 1];
      return (targetCell && targetCell.state === user) ? acc + 1 : acc;
    }
    return acc;
  }, 1) >= sizeToWin;
  const isWinner = vertical || horizontal || topLeft || topRight;
  return isWinner ? user : null;
};

const changeSize = createEvent("check size");
const clickHandler = createEffect("effect of user turn");

const $currentUser = createStore(INITIAL_USER);
const $fields = createStore(FIELDS);
const $winner = createStore(null);
const $sizeToWin = createStore(DEF_SIZE_TO_WIN);

$currentUser.on(clickHandler.done, (_, { result }) => result.nextUser).reset(changeSize);
$fields.on(clickHandler.done, (_, { result }) => result.nextFields).reset(changeSize);
$winner.on(clickHandler.done, (_, { result }) => result.winner).reset(changeSize);
$sizeToWin.on(changeSize, (_, size) => size);

clickHandler.use(({ user, cell }) => {
  const currentIndex = USERS.findIndex(item => item === user);
  const nextUser = (currentIndex === USERS.length - 1) ? INITIAL_USER : USERS[currentIndex + 1];
  const fields = $fields.getState();
  const winner = computeWinner({ fields, cell, user, sizeToWin: $sizeToWin.getState() });
  const nextFields = fields.map(row => {
    return {
      ...row,
      cells: row.cells.map(iteratedCell => {
        const isTarget = iteratedCell.rowId === cell.rowId && iteratedCell.cellId === cell.cellId;
        return { ...iteratedCell, state: isTarget ? user : iteratedCell.state };
      })
    };
  });
  return { nextUser, nextFields, winner };
});

const $domFields = combine($currentUser, $fields, (user, rows) => {
  return rows.map(row => {
    return (
      <Row key={row.id}>
        {row.cells.map(cell => {
          const { cellId, state } = cell;
          const clickable = !state;
          const props = { clickable };
          if (clickable) {
            props.onClick = () => clickHandler({ user, cell });
          }
          return (
            <Square key={cellId} {...props}>
              {state || "  -  "}
            </Square>
          );
        })}
      </Row>
    );
  });
});

export const App = () => {
  const user = useStore($currentUser);
  const winner = useStore($winner);
  const fields = useStore($domFields);
  const sizeToWin = useStore($sizeToWin);

  if (winner) return `${winner} is a winner!`;

  return (
    <div>
      <div>
        size to win:
        <select value={sizeToWin} onChange={e => changeSize(parseInt(e.target.value, 10))}>
          {SIZES_TO_WIN.map(size => <option key={size}>{size}</option>)}
        </select>
      </div>
      <div>{user} TURN</div>
      {fields}
    </div>
  );
};
