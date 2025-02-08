import { env } from "../../src/env";
import path from "node:path";

import { DataSource } from "typeorm";

const entitiesPath = path.resolve("database", "entities", "*.ts");
const migrationsPath = path.resolve("database", "migrations", "*.ts");

export const dataSource = new DataSource({
  type: "postgres",
  synchronize: false,
  logging: true,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  subscribers: [],
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
});
