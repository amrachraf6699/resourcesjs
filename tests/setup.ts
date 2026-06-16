import { webcrypto } from "node:crypto";

if (!("crypto" in globalThis)) {
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: webcrypto,
  });
}
