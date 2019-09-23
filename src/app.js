import React from "react";
import { createEffect, createStore, combine } from "effector";
import { useStore } from "effector-react";
import { Row, Square } from "./ui";

const USERS = ["Bruce Wayne", "Tony Stark"];//unique names
const INITIAL_USER = USERS[0];
const SIZE = 10;
const SIZES_TO_WIN = [3, 4, 5];
const FIELDS = Array.from(Array(SIZE).keys()).map(row => {
  return {
    id: row,
    cells: Array.from(Array(SIZE).keys()).map(cell => {
      return { rowId: row + 1, cellId: cell + 1, state: null };
    })
  };
});

const $currentUser = createStore(INITIAL_USER);
const $fields = createStore(FIELDS);
const clickHandler = createEffect("effect of user turn").use(({ user, cell }) => {
  const currentIndex = USERS.findIndex(item => item === user);
  const nextUser = (currentIndex === USERS.length - 1) ? INITIAL_USER : USERS[currentIndex + 1];
  const nextFields = $fields.getState().map(row => {
    return {
      ...row,
      cells: row.cells.map(iteratedCell => {
        const isTarget = iteratedCell.rowId === cell.rowId && iteratedCell.cellId === cell.cellId;
        return { ...iteratedCell, state: isTarget ? user : iteratedCell.state };
      })
    };
  });
  return { nextUser, nextFields };
});
$currentUser.on(clickHandler.done, (_, { result }) => result.nextUser);
$fields.on(clickHandler.done, (_, { result }) => result.nextFields);

const $domFields = combine($currentUser, $fields, (user, rows) => {
  return rows.map(row => {
    return (
      <Row key={row.id}>
        {row.cells.map(cell => {
          const { cellId, rowId, state } = cell;
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
  const fields = useStore($domFields);
  return (
    <div>
      <div>{user} TURN</div>
      {fields}
    </div>
  );
};
