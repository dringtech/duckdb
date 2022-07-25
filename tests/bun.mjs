import {
  close,
  connect,
  disconnect,
  open,
  prepare,
  query,
  stream,
} from "../lib.mjs";

const db = open(":memory:");
const connection = connect(db);

query(
  connection,
  `
  create type mood as enum ('sad', 'ok', 'happy');

  create table test (a varchar, m mood);
  insert into test (a, m) values ('a', 'sad');
`,
);

const p = prepare(connection, `select * from test`);

console.log(p.query());
