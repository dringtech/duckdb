<h1 align=center>x/duckdb</h1>
<div align=center>blazing fast <a href=https://duckdb.org>duckdb</a> bindings for deno</div>

<br />

## performance

- 2-4x faster than Bun.
- 10x faster than Node.

<details><summary>View source</summary>

```typescript
const db = open("/tmp/test.db");
const connection = db.connect();

const q = "select i, i as a from generate_series(1, 100000) s(i)";

const p = connection.prepare(q);
console.log("benchmarking query: " + q);

bench("duckdb", () => {
  p.query();
});

await run({ percentiles: false });

connection.close();
db.close();
```

</details>
<summary>

```
# Deno canary

benchmarking query: select i, i as a from generate_series(1, 100000) s(i)
cpu: Apple M1
runtime: deno 1.24.0 (aarch64-apple-darwin)

benchmark      time (avg)             (min … max)
-------------------------------------------------
duckdb       4.66 ms/iter     (4.26 ms … 7.47 ms)
```

```
# Bun
benchmarking query: select i, i as a from generate_series(1, 100000) s(i)
cpu: Apple M1
runtime: bun 0.1.4 (arm64-darwin)

benchmark      time (avg)             (min … max)
-------------------------------------------------
duckdb       8.69 ms/iter     (6.26 ms … 11.4 ms)
```

## examples

```typescript
import { open } from "https://deno.land/x/duckdb/mod.ts";

const db = open("./example.db");
// or const db = open(':memory:');

const connection = db.connect();

connection.query("select 1 as number"); // -> [{ number: 1 }]

for (const row of connection.stream("select 42 as number")) {
  row; // -> { number: 42 }
}

const prepared = connection.prepare(
  "select ?::INTEGER as number, ?::VARCHAR as text",
);

prepared.query(1337, "foo"); // -> [{ number: 1337, text: 'foo' }]
prepared.query(null, "bar"); // -> [{ number: null, text: 'bar' }]

connection.close();
db.close();
```

## Credits

Thanks to the original author of `@evan/duckdb`
[@evanwashere](https://github.com/evanwashere) for most of the implementation
that has been reused in this module.

## License

Modifications are licensed under MIT © [Divy](https://github.com/littledivy)

Original (bun version):

Apache-2.0 © [Evan](https://github.com/evanwashere)
