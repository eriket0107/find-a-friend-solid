import "dotenv/config";

import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
  JWT_SECRET: z.string().optional(),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().optional(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PORT: z.coerce.number().default(5432),
  HOST: z.string().default("localhost"),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid envoriment variables", _env.error.format());
  console.log(process.env.JWT_SECRET);
  throw new Error("Invalid envoriment variables");
}

export const env = _env.data;
