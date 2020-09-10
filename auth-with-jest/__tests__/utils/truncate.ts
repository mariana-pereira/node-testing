import {createConnection } from 'typeorm';

const truncate = async () => {
  const connection = await createConnection('test');
  const entities = connection.entityMetadatas;

  for (const entity of entities) {
    const repository = await connection.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName};`);
  }
};

export default truncate;
