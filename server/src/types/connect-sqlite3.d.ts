declare module 'connect-sqlite3' {
  import { Store } from 'express-session';

  function connectSqlite3(session: any): typeof Store;
  
  export = connectSqlite3;
}
