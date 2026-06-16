import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  elysiaApp,
  expressApp,
  fastifyApp,
  honoApp,
} from "../examples/frameworks.js";

let expressServer: ReturnType<typeof createServer>;
let expressUrl: string;

beforeAll(async () => {
  expressServer = createServer(expressApp);
  await new Promise<void>((resolve) => expressServer.listen(0, resolve));
  const address = expressServer.address() as AddressInfo;
  expressUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await fastifyApp.close();
  await new Promise<void>((resolve, reject) =>
    expressServer.close((error) => (error ? reject(error) : resolve())),
  );
});

const expected = {
  data: {
    id: 1,
    name: "John",
  },
};

describe("framework compatibility", () => {
  it("works with Express", async () => {
    const result = await fetch(`${expressUrl}/user`);
    expect(await result.json()).toEqual(expected);
  });

  it("works with Fastify", async () => {
    const result = await fastifyApp.inject({ method: "GET", url: "/user" });
    expect(result.json()).toEqual(expected);
  });

  it("works with Hono", async () => {
    const result = await honoApp.request("/user");
    expect(await result.json()).toEqual(expected);
  });

  it("works with Elysia's Node adapter", async () => {
    const result = await elysiaApp.handle(new Request("http://localhost/user"));
    expect(await result.json()).toEqual(expected);
  });
});
