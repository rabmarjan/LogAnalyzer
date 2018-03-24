
export class LevelLogger {

  static createForServer(server, tags) {
    return new LevelLogger((tags, msg) => server.log(tags, msg), tags);
  }

  constructor(logger, tags) {
    this._logger = logger;
    this._tags = tags;
  }

  error(msg, tags = []) {
    this._logger([...this._tags, ...tags, 'error'], msg);
  }

  debug(msg, tags = []) {
    this._logger([...this._tags, ...tags, 'debug'], msg);
  }

  info(msg, tags = []) {
    this._logger([...this._tags, ...tags, 'info'], msg);
  }

  clone(tags) {
    return new LevelLogger(this._logger, [...this._tags, ...tags]);
  }
}