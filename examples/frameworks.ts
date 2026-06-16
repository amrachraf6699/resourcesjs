import type { HttpContext } from "@adonisjs/core/http";
import { node } from "@elysiajs/node";
import { Controller, Get } from "@nestjs/common";
import { Elysia } from "elysia";
import express from "express";
import Fastify from "fastify";
import { Hono } from "hono";
import { ExampleUserResource, exampleUser } from "./shared.js";

export const expressApp = express().get("/user", (_request, response) => {
  response.json(ExampleUserResource.make(exampleUser));
});

export const fastifyApp = Fastify().get("/user", () =>
  ExampleUserResource.make(exampleUser),
);

export const honoApp = new Hono().get("/user", (context) =>
  context.json(ExampleUserResource.make(exampleUser)),
);

@Controller("user")
export class NestUserController {
  @Get()
  show() {
    return ExampleUserResource.make(exampleUser);
  }
}

export const elysiaApp = new Elysia({ adapter: node() }).get("/user", () =>
  ExampleUserResource.make(exampleUser),
);

export class AdonisUserController {
  show(_context: HttpContext) {
    return ExampleUserResource.make(exampleUser);
  }
}
