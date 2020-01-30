import React from "react";
import { useStore } from "effector-react";
import { Row, Square } from "./ui";
import { FIELD_SIZE, SIZES_TO_WIN } from "./config";
import {
  sizeSelectClicked,
  fieldClicked,
  restartClicked,
  $gameState,
} from "./service";

const arr = Array.from(Array(FIELD_SIZE).keys());
const FIELD_BODY = arr.map((item, row) => {
  return arr.map((item, cell) => ({ row, cell, path: `${row}.${cell}` }));
});

export const App = () => {
  const { currentUser, winner, sizeToWin, makedTurns } = useStore($gameState);

  if (winner) {
    return (
      <div>
        {winner} is a winner!
        <div onClick={restartClicked}>restart</div>
      </div>
    );
  }

  return (
    <div>
      <div>
        size to win:
        <select value={sizeToWin} onChange={sizeSelectClicked}>
          {SIZES_TO_WIN.map(size => <option key={size}>{size}</option>)}
        </select>
      </div>
      <div>{currentUser} TURN</div>
      {FIELD_BODY.map((rowItem, rowIndex) => {
        return (
          <Row key={rowIndex}>
            {rowItem.map(cellItem => {

              const color = makedTurns[cellItem.path];
              const conditionalProps = {};
              if (!color) {
                conditionalProps.onClick = fieldClicked;
              } else {
                conditionalProps.color = color;
              }

              return (
                <Square
                  key={cellItem.path}
                  data-cell={cellItem.cell}
                  data-row={cellItem.row}
                  data-path={cellItem.path}
                  data-author={currentUser}
                  {...conditionalProps}
                />
              );
            })}
          </Row>
        );
      })}
    </div>
  );
};
