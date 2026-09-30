import "server-only";

import mongoose from "mongoose";

import { env } from "@/lib/env";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Cache the connection across hot reloads (dev) and warm serverless invocations (prod).
const globalForMongoose = globalThis as typeof globalThis & { __mongoose?: MongooseCache };
const cache: MongooseCache = (globalForMongoose.__mongoose ??= { conn: null, promise: null });

mongoose.set("strictQuery", true);

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  cache.promise ??= mongoose.connect(env().MONGODB_URI, {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10_000,
  });

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
  return cache.conn;
}
