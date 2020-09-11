import { createConnection } from 'typeorm';

const createTestConnection = async () => {
  const connection = await createConnection({
    name: "test",
    type: "sqlite",
    database: "./__tests__/database.sqlite",
    dropSchema: true,
    entities: [
      "./src/app/models/*.ts"
    ],
    migrations: [
      "./src/database/migrations/*.ts"
    ],
    cli: {
      "migrationsDir": "./src/database/migrations"
    }
  });

  return connection;
};

export default createTestConnection ;
