import { createEvent, createStore, combine, sample, guard, createEffect } from "effector";
import { USERS, SIZES_TO_WIN } from "./config";
import { calc0deg, calc90deg, calc135deg, calc45deg } from "./computeScore";

export const sizeSelectClicked = createEvent("size to win clicked");
export const fieldClicked = createEvent("field clicked");
const fieldClickedSuccesfully = createEvent();
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
  (currentUser, winner, sizeToWin, makedTurns) => ({ currentUser, winner, sizeToWin, makedTurns })
);

const calcIsHaveWinnableRow = createEffect({
  handler: ({ state, path, row, cell, author }) => {
    const { makedTurns, sizeToWin } = state;
    const authorsTurns = {};
    for (const key in makedTurns) {
      if (makedTurns[key] === author) {
        authorsTurns[key] = makedTurns[key];
      }
    }
    const is0deg = calc0deg({ turns: authorsTurns, path, row, cell }) >= sizeToWin;
    const is90deg = calc90deg({ turns: authorsTurns, path, row, cell }) >= sizeToWin;
    const is135deg = calc135deg({ turns: authorsTurns, path, row, cell }) >= sizeToWin;
    const is45deg = calc45deg({ turns: authorsTurns, path, row, cell }) >= sizeToWin;
    if (is0deg || is90deg || is135deg || is45deg) return author;
    return null;
  }
});

const sizeSelectChanged = sizeSelectClicked.map(e => parseInt(e.target.value, 10));
const userChanged = fieldClickedSuccesfully.map(({ e }) => {
  const currentIndex = USERS.findIndex(item => item === e.target.dataset.author);
  return currentIndex === USERS.length - 1 ? USERS[0] : USERS[currentIndex + 1];
});
const turnMaked = fieldClickedSuccesfully.map(({ e }) => {
  const { author, path } = e.target.dataset;
  return { author, path };
});
const winnerReceived = calcIsHaveWinnableRow.done.filterMap(({ result }) => !!result && result);

guard({
  source: sample($currentUser, fieldClicked, (author, e) => ({ author, e })),
  filter: ({ author, e }) => author === e.target.dataset.author,
  target: fieldClickedSuccesfully,
});

sample({
  source: $gameState,
  clock: fieldClickedSuccesfully,
  fn: (state, { e }) => {
    const { author, path, row, cell } = e.target.dataset;
    return { state, author, path, row: parseInt(row, 10), cell: parseInt(cell, 10) };
  },
  target: calcIsHaveWinnableRow,
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
  .on(turnMaked, (config, turn) => ({ ...config, [turn.path]: turn.author }))
  .reset(sizeSelectChanged, restartClicked);
