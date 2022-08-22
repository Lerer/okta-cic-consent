import 'express-session';

declare module 'express-session' {
  interface SessionData {
    domain: string;
    state: string;
  }
}