export class SessionExpiredError extends Error {
  readonly code = "SESSION_EXPIRED";
  constructor() {
    super("Session has expired. Please log in again.");
  }
}
