import { action, makeObservable, observable } from "mobx";

class GlobalCounterStore {
  @observable counter: number;

  constructor(initialValue: number = 0) {
    this.counter = initialValue;
    makeObservable(this);
  }

  @action
  inc() {
    this.counter = this.counter + 1;
  }

  @action
  dec() {
    this.counter = this.counter - 1;
  }

  @action
  reset() {
    this.counter = 0;
  }
}

export const globalCounterStore = new GlobalCounterStore();
