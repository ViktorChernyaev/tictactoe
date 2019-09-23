import React from "react";
import { createEffect, createStore } from "effector";
import { useStore } from "effector-react";

const USERS = ["user1", "user2"];//unique names
const INITIAL_USER = USERS[0];

const $currentTurn = createStore(INITIAL_USER);
const clickHandler = createEffect("effect of user turn").use(() => {
  const current = $currentTurn.getState()
  const currentIndex = USERS.findIndex(item => item === current);

  if (currentIndex === USERS.length - 1) {
    return { nextUser: INITIAL_USER };
  }
  return { nextUser: USERS[currentIndex + 1] };
});
$currentTurn.on(clickHandler.done, (_, { result }) => result.nextUser);

export const App = () => {
  const user = useStore($currentTurn);
  return (
    <div>
      Current turn: {user}.
      <div onClick={() => clickHandler()}>change user</div>
    </div>
  );
};
