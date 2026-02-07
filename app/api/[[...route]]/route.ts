import { Hono } from "hono";
import { handle } from "hono/vercel";
import pkg from "../../../package.json";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/ping", (c) => {
  return c.json({ message: "pong" });
});

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/version", (c) => {
  const { name, version } = pkg as { name: string; version: string };
  return c.json({ name, version });
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
