import { createStore } from "effector";
import { spec, list, h, text, node } from "effector-dom";
import { SIZES_TO_WIN } from "./core/config";
import {
  sizeSelectClicked,
  $currentUser,
  $winner,
  $sizeToWin,
  $makedTurns,
} from "./core/service";

const $sizesOptions = createStore(SIZES_TO_WIN);

export const effectorDomApp = () => {
  h('div', () => {
    h('div', () => {
      text('size to win:');
      h('div', () => {
        text($sizeToWin);
      });
      // node(() => {
      //   h('div', () => {
      //     text($sizeToWin);
      //     spec({ value: $sizeToWin, handler: { change: sizeSelectClicked } });
      //     list($sizesOptions, ({ store }) => {
      //       h('option', { text: store });
      //     });
      //   });
      // });
    });
  });
};
