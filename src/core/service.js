import { createEvent, createStore, combine, sample, guard, createEffect } from "effector";
import { USERS, SIZES_TO_WIN } from "./config";
import { calc0deg, calc90deg, calc135deg, calc45deg } from "./computeScore";

export const sizeSelectClicked = createEvent("size to win clicked");
export const fieldClicked = createEvent("field clicked");
const turnMaked = createEvent("fires when clicked free field");
export const restartClicked = createEvent("restart clicked");

export const $currentUser = createStore(USERS[0]);
export const $winner = createStore(null);
export const $sizeToWin = createStore(SIZES_TO_WIN[0]);
export const $makedTurns = createStore({});

export const $gameState = combine(
  $currentUser,
  $winner,
  $sizeToWin,
  $makedTurns,
  (current, winner, size, turns) => ({ current, winner, size, turns })
);

guard({
  source: sample({
    source: $gameState,
    clock: fieldClicked,
    fn: ({ current, turns, size }, e) => {
      if (turns[e.target.dataset.path]) return {};
      const { path, row, cell } = e.target.dataset;
      return { current, turns, path, row: parseInt(row, 10), cell: parseInt(cell, 10), size };
    },
  }),
  filter: ({ current }) => !!current,
  target: turnMaked,
});

const sizeSelectChanged = sizeSelectClicked.map(e => parseInt(e.target.value, 10));
const userChanged = turnMaked.map(({ current }) => {
  const currentIndex = USERS.findIndex(item => item === current);
  return currentIndex === USERS.length - 1 ? USERS[0] : USERS[currentIndex + 1];
});
const winnerReceived = turnMaked.filterMap(({ turns, size, path, row, cell, current }) => {
  const authorsTurns = {};
  for (const key in turns) {
    if (turns[key] === current) {
      authorsTurns[key] = turns[key];
    }
  }
  const is0deg = calc0deg({ turns: authorsTurns, path, row, cell }) >= size;
  const is90deg = calc90deg({ turns: authorsTurns, path, row, cell }) >= size;
  const is135deg = calc135deg({ turns: authorsTurns, path, row, cell }) >= size;
  const is45deg = calc45deg({ turns: authorsTurns, path, row, cell }) >= size;

  if (is0deg || is90deg || is135deg || is45deg) return current;
});

$currentUser
  .on(userChanged, (_, nextUser) => nextUser)
  .reset(sizeSelectChanged, restartClicked);
$winner
  .on(winnerReceived, (_, winner) => winner)
  .reset(sizeSelectChanged, restartClicked);
$sizeToWin
  .on(sizeSelectChanged, (_, size) => size)
  .reset(restartClicked);
$makedTurns
  .on(turnMaked, (config, turn) => ({ ...config, [turn.path]: turn.current }))
  .reset(sizeSelectChanged, restartClicked);
