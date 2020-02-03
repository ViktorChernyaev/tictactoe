import React from "react";
import { useStore } from "effector-react";
import { FIELD_BODY, SIZES_TO_WIN } from "./core/config";
import {
  sizeSelectClicked,
  fieldClicked,
  restartClicked,
  $gameState,
} from "./core/service";

export const ReactApp = () => {
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
          <div className="Row" key={rowIndex}>
            {rowItem.map(cellItem => {

              const color = makedTurns[cellItem.path];
              const conditionalProps = {
                style: { backgroundColor: color || "transparent" },
                onClick: fieldClicked,
              };

              return (
                <div
                  key={cellItem.path}
                  className="Square"
                  data-cell={cellItem.cell}
                  data-row={cellItem.row}
                  data-path={cellItem.path}
                  data-author={currentUser}
                  {...conditionalProps}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
