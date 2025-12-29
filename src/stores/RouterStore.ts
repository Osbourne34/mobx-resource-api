import { type History } from "history";
import { history } from "../lib/history";

class RouterStore {
  history: History;

  constructor(history: History) {
    this.history = history;
  }
}

export const routerStore = new RouterStore(history);
