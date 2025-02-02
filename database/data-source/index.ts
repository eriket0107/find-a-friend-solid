import path from 'node:path'

import { DataSource } from 'typeorm'

const databasePath = path.resolve('src', 'database', 'sales.sqlite')
const entitiesPath = path.resolve('src', 'database', 'entities', '*.ts')
const migrationsPath = path.resolve('src', 'database', 'migrations', '*.ts')

export const dataSource = new DataSource({
  type: 'postgres',
  database: databasePath,
  synchronize: false,
  logging: true,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  subscribers: [],
})