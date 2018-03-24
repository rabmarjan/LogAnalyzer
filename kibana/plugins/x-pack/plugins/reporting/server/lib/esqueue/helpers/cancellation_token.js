import { isFunction } from 'lodash';

export class CancellationToken {
  constructor() {
    this.isCancelled = false;
    this._callbacks = [];
  }

  on = (callback) => {
    if (!isFunction(callback)) {
      throw new Error('Expected callback to be a function');
    }

    if (this.isCancelled) {
      callback();
      return;
    }

    this._callbacks.push(callback);
  };

  cancel = () => {
    this.isCancelled = true;
    this._callbacks.forEach(callback => callback());
  };
}
