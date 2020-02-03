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
  const { current, winner, size, turns } = useStore($gameState);

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
        <select value={size} onChange={sizeSelectClicked}>
          {SIZES_TO_WIN.map(sizesItem => <option key={sizesItem}>{sizesItem}</option>)}
        </select>
      </div>
      <div>{current} TURN</div>
      {FIELD_BODY.map((rowItem, rowIndex) => {
        return (
          <div className="Row" key={rowIndex}>
            {rowItem.map(cellItem => {
              const color = turns[cellItem.path];
              return (
                <div
                  key={cellItem.path}
                  className="Square"
                  data-cell={cellItem.cell}
                  data-row={cellItem.row}
                  data-path={cellItem.path}
                  data-disabled={!!color}
                  style={{ backgroundColor: color || "transparent" }}
                  onClick={fieldClicked}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
