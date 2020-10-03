import { Pool, QueryResult } from "pg";

const localPgConfig = {
  max: 1,
  user: "postgres",
  password: "postgres",
  database: "postgres",
  host: "localhost",
};

const pool = new Pool(localPgConfig);

pool.on("error", (err): void => {
  console.error("Unexpected error", err);
});

export const sqlQuery = async (queryString: string): Promise<QueryResult> =>
  pool.query(queryString);
