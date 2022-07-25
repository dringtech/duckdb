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
  install 'fts'; load 'fts';
`,
);
