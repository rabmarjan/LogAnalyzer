export class ExtractError extends Error {
  constructor(cause, message = 'Failed to extract the phantom.js archive') {
    super(message);
    this.message = message;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.cause = cause;
  }
}
