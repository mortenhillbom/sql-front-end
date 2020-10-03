import { Pool, QueryResult } from "pg";

const localPgConfig = {
  max: 1,
  user: "postgres",
  password: "postgres",
  database: "postgres",
  host: "localhost",
};

const DB_SETUP_SCRIPT_URL =
  "https://gist.githubusercontent.com/mewwts/ddaf0724a285782dc54b70411776fbc7/raw/09c8617a6d41f6c5ce8ee192a1c66ed0f1ff1580/blocks.sql";

const pool = new Pool(localPgConfig);

pool.on("error", (err): void => {
  // eslint-disable-next-line no-console
  console.error("Unexpected error", err);
});

export const sqlQuery = async (queryString: string): Promise<QueryResult> =>
  pool.query(queryString);

const tableNamesQuery = `SELECT table_name
                        FROM information_schema.tables
                        WHERE table_schema='public'
                        AND table_type='BASE TABLE';`;

export const getTables = async (): Promise<string[]> => {
  const { rows } = await sqlQuery(tableNamesQuery);
  return rows.map((t) => t.table_name);
};

export const resetDb = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  const cleanUpQuery = "DROP TABLE IF EXISTS blocks;";
  const setUpQuery = await fetch(DB_SETUP_SCRIPT_URL).then((res) => res.text());
  try {
    await sqlQuery(cleanUpQuery);
    await sqlQuery(setUpQuery);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
};
