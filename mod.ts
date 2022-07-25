import * as lib from "./lib.mjs";

export function open(path: string) {
  return new Database(lib.open(path));
}

const db_gc = new FinalizationRegistry((ptr) => lib.close(ptr));
const cc_gc = new FinalizationRegistry((ptr) => lib.disconnect(ptr));

class Database {
  #ptr: Deno.PointerValue;

  constructor(ptr: Deno.PointerValue) {
    this.#ptr = ptr;
    db_gc.register(this, ptr, this);
  }

  close() {
    lib.close(this.#ptr);
    db_gc.unregister(this);
  }
  connect() {
    return new Connection(this, lib.connect(this.#ptr));
  }
}

class Connection {
  #db: Database;
  #ptr: Deno.PointerValue;

  constructor(db: Database, ptr: Deno.PointerValue) {
    this.#db = db;
    this.#ptr = ptr;
    cc_gc.register(this, ptr, this);
  }

  query(sql: string) {
    return lib.query(this.#ptr, sql);
  }
  stream(sql: string) {
    return lib.stream(this.#ptr, sql);
  }
  close() {
    lib.disconnect(this.#ptr);
    cc_gc.unregister(this);
  }
  prepare(sql: string) {
    const p = lib.prepare(this.#ptr, sql);
    p.c = this;
    return p;
  }
}
