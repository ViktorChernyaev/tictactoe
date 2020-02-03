import { createStore, combine } from "effector";
import { spec, list, h, text, node, remap } from "effector-dom";
import { SIZES_TO_WIN, FIELD_BODY } from "./core/config";
import {
  sizeSelectClicked,
  fieldClicked,
  restartClicked,
  $currentUser,
  $winner,
  $sizeToWin,
  $makedTurns,
} from "./core/service";

export const effectorDomApp = () => {
  h("div", () => {
    spec({ visible: $winner.map(winner => !!winner) });
    h("span", { text: $winner.map(winner => `${winner} is a winner!`) });
    h("div", { text: "restart", handler: { click: restartClicked } });
  });

  h("div", () => {
    spec({ visible: $winner.map(winner => !winner) });
    h("div", () => {
      h("span", { text: "size to win:" });
      h("select", () => {
        spec({ value: $sizeToWin, handler: { change: sizeSelectClicked } });
        list(createStore(SIZES_TO_WIN), ({ store }) => {
          h("option", { text: store });
        });
      });
    });
    h("div", { text: $currentUser.map(name => `${name} TURN`) });
    list(createStore(FIELD_BODY), ({ store }) => {
      h("div", () => {
        spec({ attr: { class: "Row" } });
        list(store, ({ store }) => {
          h("div", () => {
            const $color = combine(
              store,
              $makedTurns,
              (dataset, turns) => ({ color: turns[dataset.path] || "transparent" })
            );
            spec({
              data: remap(store, { cell: "cell", row: "row", path: "path" }),
              attr: { class: "Square" },
              handler: { click: fieldClicked },
              style: remap($color, { backgroundColor: "color" }),
            });
          });
        });
      });
    });
  });
};
